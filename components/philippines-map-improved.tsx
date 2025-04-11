"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { useThemeDetector } from "@/hooks/use-theme-detector"
import { Loader2 } from "lucide-react"

// Dynamically import Plot from react-plotly.js to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

// Define region data with electrification rates by year
const regionData = [
  // 2020 data
  { YEAR: "2020", REGION: "National Capital Region (NCR)", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "1.00", hc_key: "ph-mn" },
  { YEAR: "2020", REGION: "Region 1: The Ilocos Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.97", hc_key: "ph-is" },
  { YEAR: "2020", REGION: "Region 2: Cagayan Valley Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.92", hc_key: "ph-cg" },
  { YEAR: "2020", REGION: "Region 3: Central Luzon", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.98", hc_key: "ph-tr" },
  { YEAR: "2020", REGION: "Region 4A: CALABARZON", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.96", hc_key: "ph-qz" },
  { YEAR: "2020", REGION: "Region 4B: MIMAROPA", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.85", hc_key: "ph-pl" },
  { YEAR: "2020", REGION: "Region 5: Bicol Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.89", hc_key: "ph-al" },
  { YEAR: "2020", REGION: "Region 6: Western Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.92", hc_key: "ph-cp" },
  { YEAR: "2020", REGION: "Region 7: Central Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.91", hc_key: "ph-bo" },
  { YEAR: "2020", REGION: "Region 8: Eastern Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.88", hc_key: "ph-sm" },
  { YEAR: "2020", REGION: "Region 9: Zamboanga Peninsula", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.78", hc_key: "ph-zs" },
  { YEAR: "2020", REGION: "Region 10: Northern Mindanao", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.86", hc_key: "ph-ln" },
  { YEAR: "2020", REGION: "Region 11: Davao Region", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.88", hc_key: "ph-ds" },
  { YEAR: "2020", REGION: "Region 12: SOCCSKSARGEN", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.75", hc_key: "ph-sc" },
  { YEAR: "2020", REGION: "Region 13: Caraga", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.83", hc_key: "ph-ss" },
  { YEAR: "2020", REGION: "BARMM", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.52", hc_key: "ph-su" },
  { YEAR: "2020", REGION: "Cordillera Administrative Region (CAR)", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.91", hc_key: "ph-mt" },
  
  // 2010 data
  { YEAR: "2010", REGION: "National Capital Region (NCR)", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.99", hc_key: "ph-mn" },
  { YEAR: "2010", REGION: "Region 1: The Ilocos Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.92", hc_key: "ph-is" },
  { YEAR: "2010", REGION: "Region 2: Cagayan Valley Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.83", hc_key: "ph-cg" },
  { YEAR: "2010", REGION: "Region 3: Central Luzon", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.94", hc_key: "ph-tr" },
  { YEAR: "2010", REGION: "Region 4A: CALABARZON", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.91", hc_key: "ph-qz" },
  { YEAR: "2010", REGION: "Region 4B: MIMAROPA", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.74", hc_key: "ph-pl" },
  { YEAR: "2010", REGION: "Region 5: Bicol Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.79", hc_key: "ph-al" },
  { YEAR: "2010", REGION: "Region 6: Western Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.84", hc_key: "ph-cp" },
  { YEAR: "2010", REGION: "Region 7: Central Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.85", hc_key: "ph-bo" },
  { YEAR: "2010", REGION: "Region 8: Eastern Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.74", hc_key: "ph-sm" },
  { YEAR: "2010", REGION: "Region 9: Zamboanga Peninsula", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.63", hc_key: "ph-zs" },
  { YEAR: "2010", REGION: "Region 10: Northern Mindanao", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.74", hc_key: "ph-ln" },
  { YEAR: "2010", REGION: "Region 11: Davao Region", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.77", hc_key: "ph-ds" },
  { YEAR: "2010", REGION: "Region 12: SOCCSKSARGEN", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.62", hc_key: "ph-sc" },
  { YEAR: "2010", REGION: "Region 13: Caraga", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.68", hc_key: "ph-ss" },
  { YEAR: "2010", REGION: "BARMM", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.41", hc_key: "ph-su" },
  { YEAR: "2010", REGION: "Cordillera Administrative Region (CAR)", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.83", hc_key: "ph-mt" },
  
  // 2000 data
  { YEAR: "2000", REGION: "National Capital Region (NCR)", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.97", hc_key: "ph-mn" },
  { YEAR: "2000", REGION: "Region 1: The Ilocos Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.82", hc_key: "ph-is" },
  { YEAR: "2000", REGION: "Region 2: Cagayan Valley Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.68", hc_key: "ph-cg" },
  { YEAR: "2000", REGION: "Region 3: Central Luzon", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.89", hc_key: "ph-tr" },
  { YEAR: "2000", REGION: "Region 4A: CALABARZON", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.85", hc_key: "ph-qz" },
  { YEAR: "2000", REGION: "Region 4B: MIMAROPA", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.58", hc_key: "ph-pl" },
  { YEAR: "2000", REGION: "Region 5: Bicol Region", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.62", hc_key: "ph-al" },
  { YEAR: "2000", REGION: "Region 6: Western Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.71", hc_key: "ph-cp" },
  { YEAR: "2000", REGION: "Region 7: Central Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.75", hc_key: "ph-bo" },
  { YEAR: "2000", REGION: "Region 8: Eastern Visayas", "ISLAND GROUP": "Visayas", "ELECTRIFICATION RATE": "0.57", hc_key: "ph-sm" },
  { YEAR: "2000", REGION: "Region 9: Zamboanga Peninsula", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.48", hc_key: "ph-zs" },
  { YEAR: "2000", REGION: "Region 10: Northern Mindanao", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.59", hc_key: "ph-ln" },
  { YEAR: "2000", REGION: "Region 11: Davao Region", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.64", hc_key: "ph-ds" },
  { YEAR: "2000", REGION: "Region 12: SOCCSKSARGEN", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.49", hc_key: "ph-sc" },
  { YEAR: "2000", REGION: "Region 13: Caraga", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.52", hc_key: "ph-ss" },
  { YEAR: "2000", REGION: "BARMM", "ISLAND GROUP": "Mindanao", "ELECTRIFICATION RATE": "0.28", hc_key: "ph-su" },
  { YEAR: "2000", REGION: "Cordillera Administrative Region (CAR)", "ISLAND GROUP": "Luzon", "ELECTRIFICATION RATE": "0.65", hc_key: "ph-mt" },
];

export default function PhilippinesMap() {
  const [selectedYear, setSelectedYear] = useState("2020");
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState("map");
  const isDarkTheme = useThemeDetector();

  // Filter data based on selected year
  const filteredData = useMemo(() => {
    return regionData.filter((item) => item.YEAR === selectedYear);
  }, [selectedYear]);

  // Sort data for table view
  const sortedData = useMemo(() => {
    return [...filteredData].sort(
      (a, b) => Number(b["ELECTRIFICATION RATE"]) - Number(a["ELECTRIFICATION RATE"])
    );
  }, [filteredData]);

  // Set up client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch the Philippines GeoJSON
  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://code.highcharts.com/mapdata/countries/ph/ph-all.geo.json'
        );
        const data = await response.json();
        setMapData(data);
      } catch (error) {
        console.error("Failed to load Philippines map data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isClient) {
      fetchGeoJSON();
    }
  }, [isClient]);

  // Prepare the plotly data
  const plotData = useMemo(() => {
    if (!mapData || !isClient) return null;
    
    // Create a mapping between hc_key and regions
    const keyToRegionMap = {};
    filteredData.forEach(item => {
      keyToRegionMap[item.hc_key] = {
        region: item.REGION,
        rate: parseFloat(item["ELECTRIFICATION RATE"]) * 100,
        islandGroup: item["ISLAND GROUP"]
      };
    });
    
    // Extract location ids from geojson
    const locationIds = mapData.features.map(feature => feature.properties["hc-key"]);
    
    // Map location ids to electrification rates
    const z = locationIds.map(id => {
      return keyToRegionMap[id] ? keyToRegionMap[id].rate : null;
    });
    
    // Map location ids to region names for hover text
    const text = locationIds.map(id => {
      if (!keyToRegionMap[id]) return "";
      return `<b>${keyToRegionMap[id].region}</b><br>` +
             `Electrification Rate: ${keyToRegionMap[id].rate.toFixed(1)}%<br>` +
             `Island Group: ${keyToRegionMap[id].islandGroup}`;
    });
    
    return [{
      type: "choroplethmapbox",
      geojson: mapData,
      locations: locationIds,
      z: z,
      featureidkey: "properties.hc-key",
      colorscale: [
        [0, "#f7fbff"],
        [0.125, "#deebf7"],
        [0.25, "#c6dbef"],
        [0.375, "#9ecae1"],
        [0.5, "#6baed6"],
        [0.625, "#4292c6"],
        [0.75, "#2171b5"],
        [0.875, "#08519c"],
        [1, "#08306b"],
      ],
      zmin: 25,
      zmax: 100,
      marker: {
        line: {
          width: 0.5,
          color: isDarkTheme ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
        },
        opacity: 0.9
      },
      colorbar: {
        title: "Electrification<br>Rate (%)",
        thickness: 20,
        tickmode: "array",
        tickvals: [25, 50, 75, 100],
        ticktext: ["25%", "50%", "75%", "100%"],
        tickfont: {
          color: isDarkTheme ? "white" : "black"
        },
        titlefont: {
          color: isDarkTheme ? "white" : "black"
        }
      },
      hoverinfo: "text",
      text: text
    }];
  }, [mapData, filteredData, isClient, isDarkTheme]);

  // Set up the layout
  const layout = useMemo(() => {
    return {
      mapbox: {
        style: isDarkTheme ? "carto-darkmatter" : "carto-positron",
        center: { lon: 122, lat: 12.5 },
        zoom: 4.5
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      margin: { t: 0, b: 0, l: 0, r: 0 },
      height: 600,
      font: {
        color: isDarkTheme ? "white" : "black"
      }
    };
  }, [isDarkTheme]);

  // Plot configuration
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["toImage", "select2d", "lasso2d"],
    mapboxAccessToken: "pk.eyJ1IjoicGxvdGx5bWFwYm94IiwiYSI6ImNrdm1ubHViMzBraTEydnAwa2JqdXZ6a3QifQ.PDvIQYS3fxBC1rFc7YIkvw"
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Philippines Electrification Rate</CardTitle>
          <CardDescription>Regional electrification rates across the Philippines</CardDescription>
        </div>
        <div className="flex items-center space-x-4 z-10">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2000">2000</SelectItem>
              <SelectItem value="2010">2010</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="map">Map View</SelectItem>
              <SelectItem value="table">Table View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "map" ? (
          isClient ? (
            isLoading ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="relative">
                <Plot 
                  data={plotData} 
                  layout={layout} 
                  config={config}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Electrification Rate</h4>
                  <div className="flex items-center mb-1">
                    <div className="w-full h-4 bg-gradient-to-r from-[#f7fbff] via-[#6baed6] to-[#08306b]"></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-[600px]">
              <p>Loading map...</p>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Island Group</TableHead>
                  <TableHead className="text-right">Electrification Rate (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((region) => (
                  <TableRow key={region.REGION}>
                    <TableCell className="font-medium">{region.REGION}</TableCell>
                    <TableCell>{region["ISLAND GROUP"]}</TableCell>
                    <TableCell className="text-right">
                      {(Number(region["ELECTRIFICATION RATE"]) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
