"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { comparisonData } from "@/data/comparison-data"
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface ComparisonChartProps {
  countries?: string[]
  metric?: string
}

export default function ComparisonChart({
  countries = ["Philippines", "Indonesia", "Malaysia", "Thailand", "Vietnam"],
  metric = "consumption",
}: ComparisonChartProps) {
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const isDarkTheme = useThemeDetector()

  useEffect(() => {
    setIsClient(true)

    // Filter data for selected countries and metric
    const filteredData = comparisonData
      .filter((item) => countries.includes(item.country))
      .map((item) => ({
        country: item.country,
        value: item[metric as keyof typeof item] as number,
      }))

    // Bar chart
    const data = [
      {
        x: filteredData.map((item) => item.country),
        y: filteredData.map((item) => item.value),
        type: "bar",
        marker: {
          color: "#4CAF50", // Use our primary color
          line: {
            color: "#388E3C", // Slightly darker shade
            width: 1.5,
          },
        },
      },
    ]

    setPlotData(data)
  }, [countries, metric])

  // Update the barLayout to include theme-specific colors
  const layout = {
    title: "",
    autosize: true,
    height: 500,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 30,
      b: 100,
      t: 30,
      pad: 4,
    },
    xaxis: {
      title: "",
      tickangle: -45,
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    yaxis: {
      title: getMetricTitle(metric),
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
  }

  const config = {
    responsive: true,
    displayModeBar: false,
  }

  function getMetricTitle(metric: string) {
    switch (metric) {
      case "consumption":
        return "Energy Consumption (TWh)"
      case "production":
        return "Energy Production (TWh)"
      case "renewable":
        return "Renewable Share (%)"
      case "intensity":
        return "Energy Intensity (kWh/$)"
      case "emissions":
        return "CO2 Emissions (Mt)"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country Comparison: {getMetricTitle(metric)}</CardTitle>
        <CardDescription>Comparing {metric} across selected countries</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {isClient && plotData ? (
          <Plot data={plotData} layout={layout} config={config} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            <p>Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
