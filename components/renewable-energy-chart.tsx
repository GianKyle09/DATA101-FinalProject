"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
      // Create a simple pie chart instead of sunburst for the breakdown
      // This is more reliable and should display properly
      const data = [
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

      setPlotData(data)
    }
  }, [chartType, isDarkTheme])

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
      range: [0, 70], // Increased to accommodate Laos' high percentage
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
      l: 0,
      r: 0,
      b: 0,
      t: 0,
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
        y: 1.1,
        xref: "paper",
        yref: "paper",
      },
    ],
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
