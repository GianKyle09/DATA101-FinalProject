"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { comparisonData } from "@/data/comparison-data"

// Add the theme detector import
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
  const [chartType, setChartType] = useState("bar")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Add the theme detector hook inside the component
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

    if (chartType === "bar") {
      // Bar chart
      const data = [
        {
          x: filteredData.map((item) => item.country),
          y: filteredData.map((item) => item.value),
          type: "bar",
          marker: {
            color: "rgba(55, 128, 191, 0.7)",
            line: {
              color: "rgba(55, 128, 191, 1.0)",
              width: 2,
            },
          },
        },
      ]

      setPlotData(data)
    } else if (chartType === "radar") {
      // Radar chart
      const data = [
        {
          type: "scatterpolar",
          r: [...filteredData.map((item) => item.value), filteredData[0]?.value || 0],
          theta: [...filteredData.map((item) => item.country), filteredData[0]?.country || ""],
          fill: "toself",
          name: metric,
        },
      ]

      setPlotData(data)
    } else if (chartType === "scatter") {
      // Scatter plot with GDP vs energy
      const data = [
        {
          x: filteredData.map((item) => Math.random() * 1000 + 500), // Random GDP values for demo
          y: filteredData.map((item) => item.value),
          mode: "markers+text",
          type: "scatter",
          text: filteredData.map((item) => item.country),
          textposition: "top",
          marker: {
            size: 12,
            color: "rgba(55, 128, 191, 0.7)",
            line: {
              color: "rgba(55, 128, 191, 1.0)",
              width: 2,
            },
          },
        },
      ]

      setPlotData(data)
    }
  }, [chartType, countries, metric])

  // Update the barLayout to include theme-specific colors
  const barLayout = {
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

  // Update the radarLayout to include theme-specific colors
  const radarLayout = {
    title: "",
    autosize: true,
    height: 500,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 30,
      pad: 4,
    },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, getMaxValue(metric) * 1.2],
        color: isDarkTheme ? "white" : "black",
        gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      angularaxis: {
        color: isDarkTheme ? "white" : "black",
        gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
  }

  // Update the scatterLayout to include theme-specific colors
  const scatterLayout = {
    title: "",
    autosize: true,
    height: 500,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 30,
      pad: 4,
    },
    xaxis: {
      title: "GDP per Capita (USD)",
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

  function getMaxValue(metric: string) {
    // For demo purposes
    switch (metric) {
      case "consumption":
        return 300
      case "production":
        return 250
      case "renewable":
        return 40
      case "intensity":
        return 5
      case "emissions":
        return 500
      default:
        return 100
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={chartType} onValueChange={setChartType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="radar">Radar Chart</TabsTrigger>
            <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={barLayout} config={config} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="radar" className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={radarLayout} config={config} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scatter" className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={scatterLayout} config={config} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="flex items-center justify-center h-[500px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
