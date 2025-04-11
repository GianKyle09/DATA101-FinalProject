"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { comparisonData } from "@/data/comparison-data";
import { useThemeDetector } from "@/hooks/use-theme-detector";

const Plot = dynamic(() => import("react-plotly.js"), { 
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center">Loading visualization...</div>
});

// Enhanced default data with all required metrics
const DEFAULT_DATA = [
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
  const isDarkTheme = useThemeDetector();

  useEffect(() => {
    console.log("Available comparisonData:", comparisonData); // Debug log
    console.log("Selected metric:", metric); // Debug which metric was selected
    
    const dataSource = comparisonData?.length > 0 ? comparisonData : DEFAULT_DATA;
    console.log("Using data source:", dataSource); // Debug log

    // Ensure we're correctly accessing the data
    const filteredData = dataSource
      .filter((item) => countries.includes(item.country))
      .map((item) => {
        // Check if the metric exists in the item
        if (!(metric in item)) {
          console.warn(`Metric "${metric}" not found in data for ${item.country}`);
          return { country: item.country, value: 0 };
        }
        
        // Safely access the property using string key
        return {
          country: item.country,
          value: (item as any)[metric] ?? 0 // Use type assertion to avoid TS errors
        };
      });

    console.log("Filtered data:", filteredData); // Debug log

    if (filteredData.length === 0) {
      console.warn("No data available for selected countries and metric");
      return;
    }

    // Create the plot data
    setPlotData([{
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
    }]);
  }, [countries, metric, isDarkTheme, comparisonData]); // Added comparisonData as dependency

  // Determine the appropriate title based on the metric
  const getMetricTitle = () => {
    switch (metric) {
      case "renewable": return "Renewable Energy Share";
      case "consumption": return "Energy Consumption";
      case "production": return "Energy Production";
      case "intensity": return "Energy Intensity";
      case "emissions": return "CO2 Emissions";
      default: return "Energy Analysis";
    }
  };

  // Get the appropriate y-axis title
  const getYAxisTitle = () => {
    switch (metric) {
      case "renewable": return "Renewable Share (%)";
      case "consumption": return "Energy Consumption (TWh)";
      case "production": return "Energy Production (TWh)";
      case "intensity": return "Energy Intensity (kWh/$)";
      case "emissions": return "CO2 Emissions (Mt)";
      default: return "Value";
    }
  };

  if (!plotData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getMetricTitle()}</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <p>Preparing chart data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getMetricTitle()}</CardTitle>
        <CardDescription>
          Comparing {metric.charAt(0).toUpperCase() + metric.slice(1)} across selected countries
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Plot 
          data={plotData}
          layout={{
            title: "",
            autosize: true,
            height: 500,
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            xaxis: {
              title: "",
              tickangle: -45,
              color: isDarkTheme ? "white" : "black",
            },
            yaxis: {
              title: getYAxisTitle(),
              color: isDarkTheme ? "white" : "black",
            },
            font: {
              color: isDarkTheme ? "white" : "black",
            },
            margin: { t: 30, b: 100, l: 60, r: 30 }
          }}
          config={{ 
            responsive: true,
            displayModeBar: false
          }}
          style={{ width: "100%", height: "500px" }}
          useResizeHandler
        />
      </CardContent>
    </Card>
  );
}

interface ComparisonChartProps {
  countries?: string[];
  metric?: string;
}