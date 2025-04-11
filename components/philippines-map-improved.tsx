"use client";

import { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { regionData } from '@/data/region-elecrate-year-code';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR
const Plot = dynamic(
  () => import('react-plotly.js'),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">Loading visualization...</div>
  }
);

export default function PhilippinesMap() {
  const [geoJson, setGeoJson] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<"2000" | "2010" | "2020">("2020");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/macoymejia/geojsonph/master/Regions/Regions.json'
        );
        const data = await response.json();
        setGeoJson(data);
      } catch (error) {
        console.error("Failed to load map data:", error);
      }
    };

    fetchGeoJSON();
  }, []);

  if (!geoJson) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading Philippine regions data...</p>
        </div>
      </div>
    );
  }

  // Prepare map data
  const regions = geoJson.features.map((f: any) => f.properties?.NAME);
  const values = geoJson.features.map((f: any) => {
    const match = regionData.find(d => 
      d.adm1_psgc === f.properties?.ADM1_PCODE || 
      d.REGION.includes(f.properties?.NAME)
    );
    return match ? match[selectedYear] : 0;
  });

  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {(["2000", "2010", "2020"] as const).map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedYear === year
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="w-full h-[600px]">
        <Plot
          data={[{
            type: 'choropleth',
            geojson: geoJson,
            locations: regions,
            z: values,
            featureidkey: 'properties.NAME',
            colorscale: 'Viridis',
            marker: {
              line: {
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                width: 0.5
              }
            },
            colorbar: {
              title: 'Rate (%)',
              thickness: 10,
              tickfont: { color: isDark ? '#fff' : '#000' },
              titlefont: { color: isDark ? '#fff' : '#000' }
            }
          }]}
          layout={{
            title: `Electrification Rates by Region (${selectedYear})`,
            font: { color: isDark ? '#fff' : '#000' },
            geo: {
              fitbounds: 'locations',
              projection: { type: 'mercator' },
              bgcolor: 'transparent',
              showframe: false,
              showcoastlines: false,
              subunitcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
            },
            margin: { t: 40, b: 0, l: 0, r: 0 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent'
          }}
          config={{ 
            responsive: true,
            displayModeBar: false
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </div>
    </div>
  );
}