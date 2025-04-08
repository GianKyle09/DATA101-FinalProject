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
  const [plotData, setPlotData] = useState(null)
  const [geoJson, setGeoJson] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isDarkTheme = useThemeDetector()

  // Filter data by selected year
  const filteredData = useMemo(() => {
    return regionData.filter((item) => item.YEAR === selectedYear)
  }, [selectedYear])

  // Load GeoJSON data
  useEffect(() => {
    setIsClient(true)
    
    const loadGeoJson = async () => {
      try {
        setIsLoading(true)
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
  }, [])

  // Create the choropleth map data
  useEffect(() => {
    if (!geoJson || !isClient || !filteredData.length) return

    // Create PSGC mapping to handle mismatches
    const psgcMappings = {
      "410000000": 400000000, // Region 4A: CALABARZON 
      "420000000": 400000000, // Region 4B: MIMAROPA
      "130000000": 1300000000, // NCR
      "140000000": 1400000000, // CAR
      "1500000000": 1900000000 // BARMM
    }

    // Map PSGC values to match GeoJSON
    const getMappedPSGC = (psgc) => {
      return psgcMappings[psgc] || Number(psgc)
    }

    // Create choropleth data
    const data = [{
      type: "choropleth",
      geojson: geoJson,
      featureidkey: "properties.adm1_psgc",
      locations: filteredData.map(region => getMappedPSGC(region.adm1_psgc)),
      z: filteredData.map(region => Number(region["ELECTRIFICATION RATE"]) * 100),
      text: filteredData.map(region => 
        `<b>${region.REGION}</b><br>` +
        `Electrification Rate: ${(Number(region["ELECTRIFICATION RATE"]) * 100).toFixed(1)}%`
      ),
      hoverinfo: "text",
      colorscale: "Viridis",
      zmin: 40,
      zmax: 100,
      marker: {
        line: {
          color: isDarkTheme ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
          width: 1.5
        },
        opacity: 0.85
      },
      colorbar: {
        title: "Electrification Rate (%)",
        titlefont: { color: isDarkTheme ? "white" : "black" },
        tickfont: { color: isDarkTheme ? "white" : "black" },
        x: 1,
        xpad: 20,
        len: 0.8,
        y: 0.5,
        yanchor: "middle"
      }
    }]

    setPlotData(data)
  }, [geoJson, filteredData, isDarkTheme, isClient])

  // Create the layout for the map
  const layout = useMemo(() => {
    return {
      geo: {
        scope: "asia",
        showframe: false,
        showcoastlines: true,
        projection: { type: "mercator" },
        center: { lon: 122, lat: 12 },
        lonaxis: { range: [116, 127] },
        lataxis: { range: [4, 21] },
        bgcolor: "rgba(0,0,0,0)",
        lakecolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
        landcolor: isDarkTheme ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)",
        oceancolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
        showland: true,
        showlakes: true,
        showocean: true,
        framecolor: isDarkTheme ? "white" : "black",
        coastlinecolor: isDarkTheme ? "white" : "black",
      },
      paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
      plot_bgcolor: "rgba(0,0,0,0)",
      margin: { l: 0, r: 80, t: 0, b: 0 },
      height: 500,
      autosize: true,
      font: { color: isDarkTheme ? "white" : "black" },
      separators: ".,",
      hidesources: true
    }
  }, [isDarkTheme])

  // Configuration for the map
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["toImage", "sendDataToCloud", "select2d", "lasso2d"]
  }

  return (
    <Card className="w-full relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Philippines Electrification Rate</CardTitle>
          <CardDescription>Regional electrification rates across the Philippines</CardDescription>
        </div>
        <div className="z-10 relative">
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
          <div className="relative bg-card rounded-lg overflow-hidden">
            <Plot 
              data={plotData} 
              layout={layout} 
              config={config} 
              style={{ width: "100%", height: "100%" }} 
            />
          </div>
        ) : isClient && !isLoading && !geoJson ? (
          <div className="flex flex-col space-y-4">
            <div className="bg-muted p-6 rounded-lg text-center">
              <p className="text-lg font-medium mb-4">
                Choropleth map will be displayed here after uploading GeoJSON files.
              </p>
              <p className="text-sm text-muted-foreground">
                Please upload your GeoJSON files to the /data/choropleth/ directory. 
                The main file should be named "philippines-regions.json".
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((region) => (
                <div key={region.REGION} className="bg-card border rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-sm mb-2">{region.REGION}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">{region["ISLAND GROUP"]}</span>
                    <span className="font-bold">
                      {(Number(region["ELECTRIFICATION RATE"]) * 100).toFixed(1)}%
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
