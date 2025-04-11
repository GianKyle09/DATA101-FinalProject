"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { comparisonData } from "@/data/comparison-data";
import { useThemeDetector } from "@/hooks/use-theme-detector";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ComparisonChartProps {
  countries?: string[];
  metric?: string;
}

// Default data in case comparisonData is empty
const defaultData = [
  { country: "Philippines", renewable: 25, consumption: 100, production: 80, intensity: 0.15, emissions: 150 },
  { country: "Indonesia", renewable: 15, consumption: 200, production: 180, intensity: 0.25, emissions: 300 },
  { country: "Malaysia", renewable: 20, consumption: 150, production: 120, intensity: 0.18, emissions: 200 },
  { country: "Thailand", renewable: 18, consumption: 180, production: 150, intensity: 0.20, emissions: 250 },
  { country: "Vietnam", renewable: 12, consumption: 160, production: 140, intensity: 0.22, emissions: 220 }
];

export default function ComparisonChart({
  countries = ["Philippines", "Indonesia", "Malaysia", "Thailand", "Vietnam"],
  metric = "renewable",
}: ComparisonChartProps) {
  const [plotData, setPlotData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const isDarkTheme = useThemeDetector();

  useEffect(() => {
    setIsClient(true);
    
    // Use comparisonData if available, otherwise fall back to defaultData
    const dataSource = comparisonData?.length > 0 ? comparisonData : defaultData;
    
    const filteredData = dataSource
      .filter((item) => countries.includes(item.country))
      .map((item) => ({
        country: item.country,
        value: item[metric as keyof typeof item] as number,
      }));

    const data = [{
      x: filteredData.map((item) => item.country),
      y: filteredData.map((item) => item.value),
      type: "bar",
      marker: {
        color: isDarkTheme ? "#4CAF50" : "#2E7D32",
        line: {
          color: isDarkTheme ? "#388E3C" : "#1B5E20",
          width: 1.5,
        },
      },
    }];

    setPlotData(data);
  }, [countries, metric, isDarkTheme]);

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
  };

  function getMetricTitle(metric: string) {
    const titles: Record<string, string> = {
      consumption: "Energy Consumption (TWh)",
      production: "Energy Production (TWh)",
      renewable: "Renewable Share (%)",
      intensity: "Energy Intensity (kWh/$)",
      emissions: "CO2 Emissions (Mt)",
    };
    return titles[metric] || "";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Renewable Energy Analysis</CardTitle>
        <CardDescription>
          Comparing {getMetricTitle(metric).toLowerCase()} across selected countries
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {isClient && plotData ? (
          <Plot 
            data={plotData} 
            layout={layout} 
            config={{
              responsive: true,
              displayModeBar: false,
            }} 
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="flex items-center justify-center h-[500px]">
            <p>Loading chart...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}