"use client";

import { useEffect, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { useTheme } from "next-themes";
import { regionData } from '@/data/region-elecrate-year-code';

// Client-side only Plotly import
const Plot = typeof window !== 'undefined' ? require('react-plotly.js').default : () => null;

export default function PhilippinesMap() {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<"2000" | "2010" | "2020">("2020");
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function fetchGeoJSON() {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/macoymejia/geojsonph/master/Regions/Regions.json'
        );
        if (!response.ok) throw new Error('Failed to fetch GeoJSON');
        const data = await response.json();
        setGeoJson(data);
      } catch (error) {
        console.error("Failed to load Philippines map data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGeoJSON();
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!geoJson) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center text-red-500">
          <p>Failed to load map data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Map regions using the REGION property from GeoJSON
  const regions = geoJson.features.map(feature => feature.properties?.REGION);
  const values = geoJson.features.map(feature => {
    const regionMatch = regionData.find(d => 
      d.REGION === feature.properties?.REGION
    );
    return regionMatch ? regionMatch[selectedYear] : 0;
  });

  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        {(["2000", "2010", "2020"] as const).map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedYear === year
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      
      <div className="w-full h-[600px]">
        {Plot && geoJson && (
          <Plot
            data={[{
              type: 'choropleth',
              geojson: geoJson,
              locations: regions,
              z: values,
              featureidkey: 'properties.REGION',
              colorscale: 'Viridis',
              marker: {
                line: {
                  color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  width: 0.5
                }
              },
              colorbar: {
                title: 'Electrification Rate (%)',
                thickness: 10,
                tickfont: {
                  color: isDark ? '#fff' : '#000'
                },
                titlefont: {
                  color: isDark ? '#fff' : '#000'
                }
              }
            }]}
            layout={{
              title: {
                text: `Philippines Electrification Rate by Region (${selectedYear})`,
                font: {
                  color: isDark ? '#fff' : '#000'
                }
              },
              font: {
                color: isDark ? '#fff' : '#000'
              },
              geo: {
                fitbounds: 'locations',
                projection: { type: 'mercator' },
                bgcolor: 'transparent',
                showframe: false,
                showcoastlines: false,
                showland: false,
                subunitcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
              },
              margin: { t: 50, b: 0, l: 0, r: 0 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              autosize: true
            }}
            config={{ 
              responsive: true,
              displayModeBar: false
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        )}
      </div>
    </div>
  );
}