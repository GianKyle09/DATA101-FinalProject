"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"
import { consumptionData } from "@/data/consumption-data"
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function ConsumptionChart() {
  const [country, setCountry] = useState("Philippines")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  const isDarkTheme = useThemeDetector()

  useEffect(() => {
    setIsClient(true)

    // Filter data for selected country
    const countryData = consumptionData.find((c) => c.country === country)

    if (countryData) {
      const data = [
        {
          x: countryData.years,
          y: countryData.values,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "rgb(55, 83, 109)" },
          name: "Total Consumption",
        },
        {
          x: countryData.years,
          y: countryData.residential,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "rgb(26, 118, 255)" },
          name: "Residential",
        },
        {
          x: countryData.years,
          y: countryData.industrial,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "rgb(214, 39, 40)" },
          name: "Industrial",
        },
      ]

      setPlotData(data)
    }
  }, [country, isDarkTheme])

  const layout = {
    title: "",
    autosize: true,
    height: 350,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 30,
      b: 60, // Increased to accommodate axis title
      t: 10,
      pad: 4,
    },
    xaxis: {
      title: {
        text: "Year",
        font: {
          size: 14,
          color: isDarkTheme ? "white" : "black",
        },
        standoff: 10, // Space between axis and title
      },
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    yaxis: {
      title: {
        text: "Energy Consumption (TWh)",
        font: {
          size: 14,
          color: isDarkTheme ? "white" : "black",
        },
        standoff: 10,
      },
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
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
          <CardTitle>Energy Consumption Trends</CardTitle>
          <CardDescription>Historical energy consumption by sector</CardDescription>
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
