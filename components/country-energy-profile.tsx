"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { countryProfiles } from "@/data/country-profiles"
import { useThemeDetector } from "@/hooks/use-theme-detector"

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

export default function CountryEnergyProfile({ country = "philippines" }: { country?: string }) {
  const [profileTab, setProfileTab] = useState("overview")
  const [plotData, setPlotData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Get country data based on the selected country
  const countryData = countryProfiles[country as keyof typeof countryProfiles] || countryProfiles.philippines

  const isDarkTheme = useThemeDetector()

  useEffect(() => {
    setIsClient(true)
    
    const selectedCountryData = countryProfiles[country as keyof typeof countryProfiles] || countryProfiles.Philippines
    
    if (!selectedCountryData) return
    
    if (profileTab === "overview") {
      // For the overview, we'll show GDP over time
      const data = [{
        x: selectedCountryData.year.slice(-10), // Last 10 years
        y: selectedCountryData.gdp.slice(-10).map(val => val/1e9), // Convert to billions
        type: "bar",
        marker: {
          color: "#66c2a5"
        },
        name: "GDP (Billion USD)"
      }]
      
      setPlotData(data)
    } else if (profileTab === "historical") {
      // For historical data, show GDP and population trends
      const data = [
        {
          x: selectedCountryData.year,
          y: selectedCountryData.gdp.map(val => val/1e9),
          type: "scatter",
          mode: "lines+markers",
          name: "GDP (Billion USD)",
          yaxis: 'y'
        },
        {
          x: selectedCountryData.year,
          y: selectedCountryData.population,
          type: "scatter",
          mode: "lines+markers",
          name: "Population",
          yaxis: 'y2'
        }
      ]
      
      setPlotData(data)
    } else if (profileTab === "forecast") {
      // We don't have forecast data in the new structure, 
      // so let's show per capita GDP trend instead
      const data = [{
        x: selectedCountryData.year,
        y: selectedCountryData.gdp.map((gdp, i) => 
          (gdp / selectedCountryData.population[i])),
        type: "scatter",
        mode: "lines",
        name: "GDP per Capita (USD)",
        line: {
          width: 4
        }
      }]
      
      setPlotData(data)
    }
  }, [profileTab, country])

  const overviewLayout = {
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
    yaxis: {
      title: "Energy (TWh)",
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    xaxis: {
      color: isDarkTheme ? "white" : "black",
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
  }

  const historicalLayout = {
    title: "",
    autosize: true,
    height: 400,
    paper_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    plot_bgcolor: isDarkTheme ? "rgb(17, 17, 17)" : "white",
    margin: {
      l: 50,
      r: 50, // Increased for second y-axis
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
      title: "GDP (Billion USD)",
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    yaxis2: {
      title: "Population",
      titlefont: { color: isDarkTheme ? "#ff7f0e" : "#ff7f0e" },
      tickfont: { color: isDarkTheme ? "#ff7f0e" : "#ff7f0e" },
      overlaying: 'y',
      side: 'right'
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    },
    legend: {
      x: 0.01,
      y: 0.99,
      bgcolor: isDarkTheme ? "rgba(17, 17, 17, 0.7)" : "rgba(255, 255, 255, 0.7)"
    }
  }

  const forecastLayout = {
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
      title: "GDP per Capita (USD)",
      color: isDarkTheme ? "white" : "black",
      gridcolor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    font: {
      color: isDarkTheme ? "white" : "black",
    }
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
            <h3 className="font-medium mb-2">Population (Latest)</h3>
            <p className="text-2xl font-bold">
              {countryData.population[countryData.population.length-1].toLocaleString()}
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">GDP (Latest)</h3>
            <p className="text-2xl font-bold">
              ${(countryData.gdp[countryData.gdp.length-1] / 1e9).toFixed(1)} billion
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">GDP per Capita (Latest)</h3>
            <p className="text-2xl font-bold">
              ${Math.round(countryData.gdp[countryData.gdp.length-1] / 
                countryData.population[countryData.population.length-1])}
            </p>
          </div>
        </div>

        <Tabs value={profileTab} onValueChange={setProfileTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">GDP Overview</TabsTrigger>
            <TabsTrigger value="historical">Historical Trends</TabsTrigger>
            <TabsTrigger value="forecast">GDP per Capita</TabsTrigger>
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
