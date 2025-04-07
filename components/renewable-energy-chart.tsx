"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { renewableData } from "@/data/renewable-data"

// Add the theme detector import
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function RenewableEnergyChart() {
  const [chartType, setChartType] = useState("trend")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Add the theme detector hook inside the component
  const isDarkTheme = useThemeDetector()

  useEffect(() => {
    setIsClient(true)

    if (chartType === "trend") {
      // Prepare trend data
      const data = renewableData.map((country) => ({
        x: country.years,
        y: country.percentages,
        type: "scatter",
        mode: "lines+markers",
        name: country.country,
      }))

      setPlotData(data)
    } else if (chartType === "comparison") {
      // Prepare comparison data (latest year)
      const data = [
        {
          x: renewableData.map((country) => country.country),
          y: renewableData.map((country) => country.percentages[country.percentages.length - 1]),
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
    } else if (chartType === "breakdown") {
      // Prepare breakdown data
      const data = [
        {
          type: "sunburst",
          labels: [
            "Renewable",
            "Hydro",
            "Solar",
            "Wind",
            "Bioenergy",
            "Geothermal",
            "Non-Renewable",
            "Coal",
            "Oil",
            "Natural Gas",
            "Nuclear",
          ],
          parents: [
            "",
            "Renewable",
            "Renewable",
            "Renewable",
            "Renewable",
            "Renewable",
            "",
            "Non-Renewable",
            "Non-Renewable",
            "Non-Renewable",
            "Non-Renewable",
          ],
          values: [0, 15, 8, 5, 7, 3, 0, 30, 20, 10, 2],
          branchvalues: "total",
          marker: {
            colors: [
              "#3366cc",
              "#66c2a5",
              "#fee08b",
              "#e6f598",
              "#abdda4",
              "#e78ac3",
              "#8c510a",
              "#4d4d4d",
              "#5e4fa2",
              "#3288bd",
              "#d53e4f",
            ],
          },
        },
      ]

      setPlotData(data)
    }
  }, [chartType])

  // Update the trendLayout to include theme-specific colors
  const trendLayout = {
    title: "",
    autosize: true,
    height: 400,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 10,
      pad: 4,
    },
    xaxis: {
      title: "Year",
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    yaxis: {
      title: "Renewable Energy Share (%)",
      range: [0, 40],
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
  }

  // Update the comparisonLayout to include theme-specific colors
  const comparisonLayout = {
    title: "",
    autosize: true,
    height: 400,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 30,
      b: 100,
      t: 10,
      pad: 4,
    },
    xaxis: {
      title: "",
      tickangle: -45,
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    yaxis: {
      title: "Renewable Energy Share (%)",
      range: [0, 40],
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
  }

  // Update the breakdownLayout to include theme-specific colors
  const breakdownLayout = {
    title: "",
    autosize: true,
    height: 400,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 10,
      r: 10,
      b: 10,
      t: 10,
      pad: 4,
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
      <CardHeader>
        <CardTitle>Renewable Energy Analysis</CardTitle>
        <CardDescription>Trends and comparison of renewable energy adoption</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={setChartType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trend">Historical Trend</TabsTrigger>
            <TabsTrigger value="comparison">Country Comparison</TabsTrigger>
            <TabsTrigger value="breakdown">Energy Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={trendLayout} config={config} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="mt-4">
            {isClient && plotData ? (
              <Plot
                data={plotData}
                layout={comparisonLayout}
                config={config}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="breakdown" className="mt-4">
            {isClient && plotData ? (
              <Plot
                data={plotData}
                layout={breakdownLayout}
                config={config}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

