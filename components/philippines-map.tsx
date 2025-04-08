"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
import { regionData } from "@/data/region-elecrate-year-code"
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

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

    // Prepare data for the choropleth map
    const data = [
      {
        type: "choropleth",
        geojson: geoJson,
        featureidkey: "properties.id",
        locations: filteredData.map((region) => region.adm1_psgc),
        z: filteredData.map((region) => Number.parseFloat(region["ELECTRIFICATION RATE"]) * 100),
        text: filteredData.map((region) => region.REGION),
        colorscale: "Viridis",
        zmin: 0,
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Philippines Electrification Rate</CardTitle>
          <CardDescription>Regional electrification rates across the Philippines</CardDescription>
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
      </CardHeader>
      <CardContent>
        {isClient && !isLoading && geoJson && plotData ? (
          <Plot data={plotData} layout={layout} config={config} style={{ width: "100%", height: "100%" }} />
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
