"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
import { productionData } from "@/data/production-data"
// Add the theme detector import
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function ProductionChart() {
  const [country, setCountry] = useState("Philippines")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Add the theme detector hook inside the component
  const isDarkTheme = useThemeDetector()

  useEffect(() => {
    setIsClient(true)

    // Filter data for selected country
    const countryData = productionData.find((c) => c.country === country)

    if (countryData) {
      const data = [
        {
          labels: ["Coal", "Oil", "Natural Gas", "Hydro", "Solar", "Wind", "Biofuels", "Other"],
          values: [
            countryData.coal,
            countryData.oil,
            countryData.naturalGas,
            countryData.hydro,
            countryData.solar,
            countryData.wind,
            countryData.biofuels,
            countryData.other,
          ],
          type: "pie",
          hole: 0.4,
          marker: {
            colors: [
              "#4d4d4d", // Coal
              "#5e4fa2", // Oil
              "#3288bd", // Natural Gas
              "#66c2a5", // Hydro
              "#fee08b", // Solar
              "#e6f598", // Wind
              "#9e0142", // Biofuels
              "#f46d43", // Other
            ],
          },
        },
      ]

      setPlotData(data)
    }
  }, [country])

  // Update the layout to include theme-specific colors
  const layout = {
    title: "",
    autosize: true,
    height: 350,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 30,
      r: 30,
      b: 30,
      t: 10,
      pad: 4,
    },
    legend: {
      orientation: "h",
      y: -0.2,
      font: {
        color: isDarkTheme ? "white" : "black",
      },
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
  }

  const config = {
    responsive: true,
    displayModeBar: false,
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Energy Production Mix</CardTitle>
          <CardDescription>Breakdown of energy sources</CardDescription>
        </div>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Philippines">Philippines</SelectItem>
            <SelectItem value="Indonesia">Indonesia</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
            <SelectItem value="Thailand">Thailand</SelectItem>
            <SelectItem value="Vietnam">Vietnam</SelectItem>
            <SelectItem value="Singapore">Singapore</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isClient && plotData ? (
          <Plot data={plotData} layout={layout} config={config} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="flex items-center justify-center h-[350px]">
            <p>Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

