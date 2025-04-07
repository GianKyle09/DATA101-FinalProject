"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { comparisonData } from "@/data/comparison-data"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function ComparisonChart() {
  const [chartType, setChartType] = useState("bar")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // For demo purposes, we'll use consumption data for selected countries
  const selectedCountries = ["Philippines", "Indonesia", "Malaysia", "Thailand", "Vietnam"]
  const metric = "consumption"

  useEffect(() => {
    setIsClient(true)

    // Filter data for selected countries and metric
    const filteredData = comparisonData
      .filter((item) => selectedCountries.includes(item.country))
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
          r: [...filteredData.map((item) => item.value), filteredData[0].value],
          theta: [...filteredData.map((item) => item.country), filteredData[0].country],
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
  }, [chartType])

  const barLayout = {
    title: "",
    autosize: true,
    height: 500,
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
    },
    yaxis: {
      title: getMetricTitle(metric),
    },
  }

  const radarLayout = {
    title: "",
    autosize: true,
    height: 500,
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
      },
    },
  }

  const scatterLayout = {
    title: "",
    autosize: true,
    height: 500,
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 30,
      pad: 4,
    },
    xaxis: {
      title: "GDP per Capita (USD)",
    },
    yaxis: {
      title: getMetricTitle(metric),
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

