"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { renewableData } from "@/data/renewable-data"
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function RenewableEnergyChart() {
  const [chartType, setChartType] = useState("trend")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const isDarkTheme = useThemeDetector()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use useMemo to calculate plot data based on chartType
  const chartData = useMemo(() => {
    if (!isClient) return null

    if (chartType === "trend") {
      // Prepare trend data
      return renewableData.map((country) => ({
        x: country.years,
        y: country.percentages,
        type: "scatter",
        mode: "lines+markers",
        name: country.country,
      }))
    } else if (chartType === "comparison") {
      // Prepare comparison data (latest year)
      return [
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
    } else if (chartType === "breakdown") {
      // Create a simple pie chart for the breakdown
      return [
        {
          values: [30, 15, 8, 5, 7, 3, 20, 10, 2],
          labels: ["Coal", "Hydro", "Solar", "Wind", "Bioenergy", "Geothermal", "Oil", "Natural Gas", "Nuclear"],
          type: "pie",
          hole: 0.4,
          marker: {
            colors: [
              "#4d4d4d", // Coal
              "#66c2a5", // Hydro
              "#fee08b", // Solar
              "#e6f598", // Wind
              "#abdda4", // Bioenergy
              "#e78ac3", // Geothermal
              "#5e4fa2", // Oil
              "#3288bd", // Natural Gas
              "#d53e4f", // Nuclear
            ],
          },
          textinfo: "label+percent",
          hoverinfo: "label+value+percent",
          textposition: "outside",
          automargin: true,
        },
      ]
    }

    return null
  }, [chartType, isClient])

  // Update plotData when chartData changes
  useEffect(() => {
    if (chartData) {
      setPlotData(chartData)
    }
  }, [chartData])

  // Use useMemo for layouts to prevent unnecessary recalculations
  const trendLayout = useMemo(
    () => ({
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
        range: [0, 70], // Increased to accommodate Laos' high percentage
        color: isDarkTheme ? "white" : "black",
        gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      font: {
        color: isDarkTheme ? "white" : "black",
      },
      legend: {
        font: {
          color: isDarkTheme ? "white" : "black",
        },
      },
    }),
    [isDarkTheme],
  )

  const comparisonLayout = useMemo(
    () => ({
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
        range: [0, 70], // Increased to accommodate Laos' high percentage
        color: isDarkTheme ? "white" : "black",
        gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      font: {
        color: isDarkTheme ? "white" : "black",
      },
    }),
    [isDarkTheme],
  )

  const breakdownLayout = useMemo(
    () => ({
      title: "",
      autosize: true,
      height: 400,
      paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
      plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 30,
      },
      font: {
        color: isDarkTheme ? "white" : "black",
      },
      legend: {
        font: {
          color: isDarkTheme ? "white" : "black",
        },
      },
      annotations: [
        {
          font: {
            size: 16,
            color: isDarkTheme ? "white" : "black",
          },
          showarrow: false,
          text: "Energy Sources Breakdown",
          x: 0.5,
          y: 1.05,
          xref: "paper",
          yref: "paper",
        },
      ],
    }),
    [isDarkTheme],
  )

  const config = {
    responsive: true,
    displayModeBar: false,
  }

  // Get the current layout based on chartType
  const currentLayout = useMemo(() => {
    if (chartType === "trend") return trendLayout
    if (chartType === "comparison") return comparisonLayout
    if (chartType === "breakdown") return breakdownLayout
    return trendLayout
  }, [chartType, trendLayout, comparisonLayout, breakdownLayout])

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

          <div className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={currentLayout} config={config} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p>Loading chart...</p>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
