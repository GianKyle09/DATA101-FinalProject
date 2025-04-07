"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { countryProfiles } from "@/data/country-profiles"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function CountryEnergyProfile() {
  const [profileTab, setProfileTab] = useState("overview")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // For demo purposes, we'll use Philippines data
  const countryData = countryProfiles.philippines

  useEffect(() => {
    setIsClient(true)

    if (profileTab === "overview") {
      // Overview data - energy balance
      const data = [
        {
          x: ["Production", "Imports", "Exports", "Consumption"],
          y: [countryData.production, countryData.imports, -countryData.exports, countryData.consumption],
          type: "bar",
          marker: {
            color: ["#66c2a5", "#3288bd", "#d53e4f", "#5e4fa2"],
          },
        },
      ]

      setPlotData(data)
    } else if (profileTab === "historical") {
      // Historical data
      const data = [
        {
          x: countryData.years,
          y: countryData.historicalConsumption,
          type: "scatter",
          mode: "lines+markers",
          name: "Consumption",
        },
        {
          x: countryData.years,
          y: countryData.historicalProduction,
          type: "scatter",
          mode: "lines+markers",
          name: "Production",
        },
      ]

      setPlotData(data)
    } else if (profileTab === "forecast") {
      // Forecast data
      const data = [
        {
          x: countryData.forecastYears,
          y: countryData.forecastConsumption,
          type: "scatter",
          mode: "lines",
          name: "Consumption Forecast",
          line: {
            dash: "solid",
            width: 4,
          },
        },
        {
          x: countryData.forecastYears,
          y: countryData.forecastProduction,
          type: "scatter",
          mode: "lines",
          name: "Production Forecast",
          line: {
            dash: "solid",
            width: 4,
          },
        },
      ]

      setPlotData(data)
    }
  }, [profileTab])

  const overviewLayout = {
    title: "",
    autosize: true,
    height: 400,
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 10,
      pad: 4,
    },
    yaxis: {
      title: "Energy (TWh)",
    },
  }

  const historicalLayout = {
    title: "",
    autosize: true,
    height: 400,
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 10,
      pad: 4,
    },
    xaxis: {
      title: "Year",
    },
    yaxis: {
      title: "Energy (TWh)",
    },
  }

  const forecastLayout = {
    title: "",
    autosize: true,
    height: 400,
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 10,
      pad: 4,
    },
    xaxis: {
      title: "Year",
    },
    yaxis: {
      title: "Energy (TWh)",
    },
    shapes: [
      {
        type: "line",
        x0: 2023,
        y0: 0,
        x1: 2023,
        y1: 1,
        yref: "paper",
        line: {
          color: "grey",
          width: 1,
          dash: "dot",
        },
      },
    ],
    annotations: [
      {
        x: 2023,
        y: 1,
        yref: "paper",
        text: "Forecast →",
        showarrow: false,
        xanchor: "left",
        bgcolor: "rgba(255, 255, 255, 0.8)",
      },
    ],
  }

  const config = {
    responsive: true,
    displayModeBar: false,
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Population</h3>
            <p className="text-2xl font-bold">{countryData.population.toLocaleString()}</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">GDP (USD)</h3>
            <p className="text-2xl font-bold">${(countryData.gdp / 1e9).toFixed(1)} billion</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Energy Intensity</h3>
            <p className="text-2xl font-bold">{countryData.energyIntensity.toFixed(2)} kWh/$</p>
          </div>
        </div>

        <Tabs value={profileTab} onValueChange={setProfileTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Energy Balance</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={overviewLayout} config={config} style={{ width: "100%", height: "100%" }} />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="historical" className="mt-4">
            {isClient && plotData ? (
              <Plot
                data={plotData}
                layout={historicalLayout}
                config={config}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <p>Loading chart...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="forecast" className="mt-4">
            {isClient && plotData ? (
              <Plot data={plotData} layout={forecastLayout} config={config} style={{ width: "100%", height: "100%" }} />
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

