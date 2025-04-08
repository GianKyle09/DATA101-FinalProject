"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
import { regionData } from "@/data/region-elecrate-year-code"
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

// Helper function to normalize IDs for comparison
const normalizeId = (id: any): string => {
  if (id === undefined || id === null) return ""
  return String(id).trim()
}

export default function PhilippinesMap() {
  const [selectedYear, setSelectedYear] = useState("2020")
  const [plotData, setPlotData] = useState<any>(null)
  const [geoJson, setGeoJson] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isDarkTheme = useThemeDetector()

  // Use useMemo to calculate filteredData only when selectedYear changes
  const filteredData = useMemo(() => {
    return regionData.filter((item) => item.YEAR === selectedYear)
  }, [selectedYear])

  // First useEffect - only runs once to set isClient and load GeoJSON
  useEffect(() => {
    setIsClient(true)

    // Function to load GeoJSON data
    const loadGeoJson = async () => {
      try {
        setIsLoading(true)
        // Try to fetch the GeoJSON file from the data/choropleth directory
        const response = await fetch("/data/choropleth/philippines-regions.json")
        if (!response.ok) {
          throw new Error("GeoJSON file not found")
        }
        const data = await response.json()

        // Process the GeoJSON to ensure IDs are in the right format
        if (data && data.features) {
          // Add a normalized ID to each feature for easier matching
          data.features = data.features.map((feature: any) => {
            // Try to extract ID from various possible locations
            const possibleIds = [
              feature.id,
              feature.properties?.id,
              feature.properties?.adm1_psgc,
              feature.properties?.PSGC,
            ]

            // Find the first non-empty ID
            const id = possibleIds.find((id) => id !== undefined && id !== null)

            // Add a normalized ID to the properties
            if (id !== undefined) {
              feature.properties = feature.properties || {}
              feature.properties._normalizedId = normalizeId(id)
            }

            return feature
          })
        }

        setGeoJson(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading GeoJSON:", error)
        setIsLoading(false)
      }
    }

    loadGeoJson()
  }, []) // Empty dependency array - runs only once

  // Second useEffect - prepare plot data when dependencies change
  useEffect(() => {
    if (!geoJson || !isClient || !filteredData.length) return

    // Normalize our data IDs
    const normalizedData = filteredData.map((region) => ({
      ...region,
      _normalizedId: normalizeId(region.adm1_psgc),
    }))

    // Log the first few features and data items for debugging
    console.log("First 3 GeoJSON features:", geoJson.features.slice(0, 3))
    console.log("First 3 data items:", normalizedData.slice(0, 3))

    // Prepare data for the choropleth map
    const data = [
      {
        type: "choropleth",
        geojson: geoJson,
        featureidkey: "properties._normalizedId",
        locations: normalizedData.map((region) => region._normalizedId),
        z: normalizedData.map((region) => Number.parseFloat(region["ELECTRIFICATION RATE"]) * 100),
        text: normalizedData.map(
          (region) =>
            `${region.REGION}<br>Electrification Rate: ${(Number.parseFloat(region["ELECTRIFICATION RATE"]) * 100).toFixed(1)}%`,
        ),
        hoverinfo: "text",
        colorscale: "Viridis",
        zmin: 40, // Set minimum to make color differences more visible
        zmax: 100,
        marker: {
          line: {
            color: isDarkTheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            width: 0.5,
          },
        },
        colorbar: {
          title: "Electrification Rate (%)",
          titlefont: {
            color: isDarkTheme ? "white" : "black",
          },
          tickfont: {
            color: isDarkTheme ? "white" : "black",
          },
        },
      },
    ]

    setPlotData(data)
  }, [geoJson, filteredData, isDarkTheme, isClient])

  // Use useMemo for layout to prevent unnecessary recalculations
  const layout = useMemo(() => {
    return {
      title: "",
      geo: {
        scope: "asia",
        showframe: false,
        showcoastlines: true,
        projection: {
          type: "mercator",
        },
        center: {
          lon: 122,
          lat: 12,
        },
        lonaxis: {
          range: [116, 127],
        },
        lataxis: {
          range: [4, 21],
        },
        bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
        lakecolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
        landcolor: isDarkTheme ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)",
        oceancolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
      },
      paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
      plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
      margin: {
        l: 0,
        r: 0,
        t: 0,
        b: 0,
      },
      height: 500,
      autosize: true,
      font: {
        color: isDarkTheme ? "white" : "black",
      },
    }
  }, [isDarkTheme])

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["toImage", "sendDataToCloud", "select2d", "lasso2d"],
  }

  return (
    <Card className="w-full relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Philippines Electrification Rate</CardTitle>
          <CardDescription>Regional electrification rates across the Philippines</CardDescription>
        </div>
        <div className="z-50 relative">
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
      </CardHeader>
      <CardContent>
        {isClient && !isLoading && geoJson && plotData ? (
          <div className="relative">
            <Plot data={plotData} layout={layout} config={config} style={{ width: "100%", height: "100%" }} />
          </div>
        ) : isClient && !isLoading && !geoJson ? (
          <div className="flex flex-col space-y-4">
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-lg font-medium mb-4">
                Choropleth map will be displayed here after uploading GeoJSON files.
              </p>
              <p className="text-sm text-muted-foreground">
                Please upload your GeoJSON files to the /data/choropleth/ directory. The main file should be named
                "philippines-regions.json".
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((region) => (
                <div key={region.REGION} className="bg-card border rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-sm mb-2">{region.REGION}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">{region["ISLAND GROUP"]}</span>
                    <span className="font-bold">
                      {(Number.parseFloat(region["ELECTRIFICATION RATE"]) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            <p>Loading map...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
