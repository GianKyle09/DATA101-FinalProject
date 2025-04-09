"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { regionData } from "@/data/region-elecrate-year-code"
import { useThemeDetector } from "@/hooks/use-theme-detector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GeoJSONFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[][][] | number[][]
  }
  properties: {
    adm1_psgc: number
    adm1_en: string
    geo_level: string
    len_crs: number
    area_crs: number
    len_km: number
    area_km2: number
  }
  id: number
}

interface GeoJSON {
  type: string
  features: GeoJSONFeature[]
}

export default function PhilippinesMap() {
  const [selectedYear, setSelectedYear] = useState("2020")
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [geojsonData, setGeojsonData] = useState<GeoJSON | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isDarkTheme = useThemeDetector()

  // Filter data based on selected year
  const filteredData = useMemo(() => {
    return regionData.filter((item) => item.YEAR === selectedYear)
  }, [selectedYear])

  // Create a map of region to electrification rate
  const regionRates = useMemo(() => {
    const rates: Record<string, number> = {}
    filteredData.forEach((item) => {
      rates[item.REGION] = Number.parseFloat(item["ELECTRIFICATION RATE"]) * 100
    })
    return rates
  }, [filteredData])

  // Helper function to get color based on value
  const getColor = (value: number): string => {
    // Define color stops for the gradient (from 40% to 100%)
    const colorStops = [
      { value: 40, color: "#440154" }, // Dark purple
      { value: 50, color: "#3b528b" }, // Purple-blue
      { value: 60, color: "#21918c" }, // Teal
      { value: 70, color: "#5ec962" }, // Light green
      { value: 80, color: "#9de341" }, // Yellow-green
      { value: 90, color: "#fde725" }, // Yellow
      { value: 100, color: "#ffffe0" }, // Light yellow
    ]

    // Find the appropriate color based on value
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (value <= colorStops[i + 1].value) {
        const ratio = (value - colorStops[i].value) / (colorStops[i + 1].value - colorStops[i].value)

        // Parse the hex colors to RGB
        const color1 = {
          r: Number.parseInt(colorStops[i].color.slice(1, 3), 16),
          g: Number.parseInt(colorStops[i].color.slice(3, 5), 16),
          b: Number.parseInt(colorStops[i].color.slice(5, 7), 16),
        }

        const color2 = {
          r: Number.parseInt(colorStops[i + 1].color.slice(1, 3), 16),
          g: Number.parseInt(colorStops[i + 1].color.slice(3, 5), 16),
          b: Number.parseInt(colorStops[i + 1].color.slice(5, 7), 16),
        }

        // Interpolate between the two colors
        const r = Math.round(color1.r + ratio * (color2.r - color1.r))
        const g = Math.round(color1.g + ratio * (color2.g - color1.g))
        const b = Math.round(color1.b + ratio * (color2.b - color1.b))

        return `rgb(${r}, ${g}, ${b})`
      }
    }

    return colorStops[colorStops.length - 1].color
  }

  // Create legend items
  const legendItems = useMemo(() => {
    return [40, 50, 60, 70, 80, 90, 100].map((value) => ({
      value,
      color: getColor(value),
    }))
  }, [])

  // Map region names from GeoJSON to our data format
  const mapRegionName = (geojsonName: string): string | null => {
    // Map of GeoJSON region names to our data region names
    const regionMap: Record<string, string> = {
      "Ilocos Norte": "Region 1: The Ilocos Region",
      "Ilocos Sur": "Region 1: The Ilocos Region",
      "La Union": "Region 1: The Ilocos Region",
      Pangasinan: "Region 1: The Ilocos Region",
      // Rest of the mapping...
    }

    return regionMap[geojsonName] || null
  }

  // Function to get region rate from province name
  const getRegionRateFromProvince = (provinceName: string): number => {
    const regionName = mapRegionName(provinceName)
    if (!regionName || !regionRates[regionName]) return 0
    return regionRates[regionName]
  }

  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/data/choropleth/country.0.001.json")
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status} ${response.statusText}`)
        }

        const data: GeoJSON = await response.json()
        setGeojsonData(data)
      } catch (e: any) {
        console.error("Failed to load GeoJSON data:", e)
        setError("Failed to load GeoJSON data.")
      } finally {
        setLoading(false)
      }
    }

    loadGeoJSON()
  }, [])

  // Safely process path data for SVG
  const generatePathData = (feature: GeoJSONFeature): string => {
    let pathData = ""
    try {
      if (feature.geometry && feature.geometry.coordinates) {
        // Handle MultiPolygon geometry type (which your data uses)
        if (feature.geometry.type === "MultiPolygon") {
          pathData = feature.geometry.coordinates.map((polygon: any) => {
            if (!Array.isArray(polygon)) return ""
            return polygon.map((ring: any) => {
              if (!Array.isArray(ring)) return ""
              return ring.map((coord: any, i: number) => {
                if (!Array.isArray(coord)) return ""
                const [x, y] = coord
                return `${i === 0 ? "M" : "L"}${x},${y}`
              }).join(" ")
            }).join(" ")
          }).join(" ")
        }
        // Handle Polygon geometry type (for completeness)
        else if (feature.geometry.type === "Polygon") {
          pathData = feature.geometry.coordinates.map((ring: any) => {
            if (!Array.isArray(ring)) return ""
            return ring.map((coord: any, i: number) => {
              if (!Array.isArray(coord)) return ""
              const [x, y] = coord
              return `${i === 0 ? "M" : "L"}${x},${y}`
            }).join(" ")
          }).join(" ")
        }
      }
    } catch (error) {
      console.error("Error generating path for feature:", feature.id, error)
    }
    return pathData
  }

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-semibold">Philippines Electrification Rate</h2>
          <p className="text-muted-foreground">Regional electrification rates across the Philippines</p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">2000</SelectItem>
            <SelectItem value="2010">2010</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-6 pt-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 relative">
            {loading && <p>Loading map...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {geojsonData && (
              <svg
                preserveAspectRatio="xMidYMid meet"
                viewBox="115 0 30 30"
                className="w-full h-auto border border-gray-200 dark:border-gray-700 rounded-lg"
                style={{ backgroundColor: isDarkTheme ? "#111" : "#fff" }}
              >
                <g transform="scale(1, -1) translate(0, -30)">
                  {geojsonData.features.map((feature, index) => {
                    const regionName = feature.properties.adm1_en
                    const rate = regionRates[regionName] || 0
                    const color = getColor(rate)
                    const pathData = generatePathData(feature)
                    
                    // Only render path if we have valid path data
                    if (!pathData) return null

                    return (
                      <path
                        key={index}
                        d={pathData}
                        fill={color}
                        stroke={isDarkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                        strokeWidth="0.5"
                        onMouseEnter={() => setHoveredRegion(regionName)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className="transition-colors duration-200 hover:opacity-80"
                      />
                    )
                  })}
                </g>
              </svg>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 md:mt-0 md:ml-6 md:w-48">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-2">Electrification Rate (%)</h4>
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-center mb-1">
                  <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{index > 0 ? `${legendItems[index - 1].value}-${item.value}%` : `< ${item.value}%`}</span>
                </div>
              ))}
            </div>

            {/* Data table for small screens */}
            <div className="mt-4 md:hidden">
              <h4 className="font-medium mb-2">Region Data</h4>
              <div className="max-h-60 overflow-y-auto">
                {filteredData.map((region) => (
                  <div key={region.REGION} className="mb-2">
                    <p className="text-sm font-medium">{region.REGION}</p>
                    <p className="text-sm">{(Number.parseFloat(region["ELECTRIFICATION RATE"]) * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}