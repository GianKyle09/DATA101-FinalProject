"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
import { aseanData } from "@/data/asean-data"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function EnergyMap() {
  const [mapMetric, setMapMetric] = useState("consumption")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Prepare data for the selected metric
    const data = {
      type: "choropleth",
      locationmode: "country names",
      locations: aseanData.map((country) => country.name),
      z: aseanData.map((country) => country[mapMetric as keyof typeof country] as number),
      text: aseanData.map((country) => country.name),
      colorscale: "Viridis",
      autocolorscale: false,
      reversescale: false,
      marker: {
        line: {
          color: "rgba(0,0,0,0.5)",
          width: 0.5,
        },
      },
      colorbar: {
        title:
          mapMetric === "consumption"
            ? "Energy Consumption (TWh)"
            : mapMetric === "production"
              ? "Energy Production (TWh)"
              : "Renewable Share (%)",
      },
    }

    setPlotData([data])
  }, [mapMetric])

  const layout = {
    geo: {
      scope: "asia",
      showframe: false,
      showcoastlines: true,
      projection: {
        type: "mercator",
      },
      center: {
        lon: 115,
        lat: 10,
      },
      lonaxis: {
        range: [90, 150],
      },
      lataxis: {
        range: [-10, 30],
      },
    },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
    },
    height: 500,
    autosize: true,
  }

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["toImage", "sendDataToCloud", "select2d", "lasso2d"],
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Energy Map</CardTitle>
          <CardDescription>Geographical visualization of energy statistics across ASEAN</CardDescription>
        </div>
        <Select value={mapMetric} onValueChange={setMapMetric}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consumption">Consumption</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="renewableShare">Renewable Share</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isClient && plotData ? (
          <Plot data={plotData} layout={layout} config={config} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            <p>Loading map...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

