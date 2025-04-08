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
  const [debugInfo, setDebugInfo] = useState<any>(null)
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

    // Debug: Log GeoJSON structure and our data to identify mismatches
    const geoJsonIds = geoJson.features.map((feature: any) => {
      // Extract the ID that should match our data
      return {
        id: feature.properties.id || feature.id || feature.properties.adm1_psgc,
        properties: feature.properties,
      }
    })

    const dataIds = filteredData.map((region) => region.adm1_psgc)

    // Find which IDs from our data are missing in the GeoJSON
    const missingInGeoJson = dataIds.filter((id) => !geoJsonIds.some((geoId: any) => String(geoId.id) === String(id)))

    // Find which IDs from GeoJSON are missing in our data
    const missingInData = geoJsonIds.filter((geoId: any) => !dataIds.some((id) => String(id) === String(geoId.id)))

    // Store debug info for display
    setDebugInfo({
      geoJsonFeatureCount: geoJson.features.length,
      dataCount: filteredData.length,
      missingInGeoJson,
      missingInData,
      sampleGeoJsonFeature: geoJson.features[0],
      sampleDataItem: filteredData[0],
    })

    console.log("Debug Info:", {
      geoJsonFeatureCount: geoJson.features.length,
      dataCount: filteredData.length,
      missingInGeoJson,
      missingInData,
      sampleGeoJsonFeature: geoJson.features[0],
      sampleDataItem: filteredData[0],
    })

    // Try to determine the correct ID field in the GeoJSON
    let featureIdKey = "properties.adm1_psgc"
    if (geoJson.features[0]?.properties?.id) {
      featureIdKey = "properties.id"
    } else if (geoJson.features[0]?.id) {
      featureIdKey = "id"
    }

    console.log("Using featureIdKey:", featureIdKey)

    // Prepare data for the choropleth map
    const data = [
      {
        type: "choropleth",
        geojson: geoJson,
        featureidkey: featureIdKey,
        locations: filteredData.map((region) => region.adm1_psgc),
        z: filteredData.map((region) => Number.parseFloat(region["ELECTRIFICATION RATE"]) * 100),
        text: filteredData.map(
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

            {/* Debug panel - can be removed in production */}
            {debugInfo && (
              <div className="mt-4 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
                <h4 className="font-bold mb-2">Debug Information</h4>
                <p>GeoJSON Features: {debugInfo.geoJsonFeatureCount}</p>
                <p>Data Items: {debugInfo.dataCount}</p>
                <p>Missing in GeoJSON: {debugInfo.missingInGeoJson.length} IDs</p>
                <p>Missing in Data: {debugInfo.missingInData.length} IDs</p>
                <details>
                  <summary className="cursor-pointer">View Details</summary>
                  <div className="mt-2">
                    <p className="font-bold">Sample GeoJSON Feature ID Structure:</p>
                    <pre className="bg-card p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(
                        {
                          id: debugInfo.sampleGeoJsonFeature?.id,
                          "properties.id": debugInfo.sampleGeoJsonFeature?.properties?.id,
                          "properties.adm1_psgc": debugInfo.sampleGeoJsonFeature?.properties?.adm1_psgc,
                        },
                        null,
                        2,
                      )}
                    </pre>

                    <p className="font-bold mt-2">Sample Data Item:</p>
                    <pre className="bg-card p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(
                        {
                          adm1_psgc: debugInfo.sampleDataItem?.adm1_psgc,
                          REGION: debugInfo.sampleDataItem?.REGION,
                        },
                        null,
                        2,
                      )}
                    </pre>

                    <p className="font-bold mt-2">Missing IDs in GeoJSON:</p>
                    <pre className="bg-card p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(debugInfo.missingInGeoJson, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}
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
