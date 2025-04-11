"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FeatureCollection } from 'geojson';
import { useTheme } from "next-themes";
import { regionData } from '@/data/region-elecrate-year-code';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

function PhilippinesMap() {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<"2000" | "2010" | "2020">("2020");
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/macoymejia/geojsonph/master/Regions/Regions.json'
        );
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

  if (isLoading) return <div>Loading map...</div>;
  if (!geoJson) return <div>Failed to load map data</div>;

  const regions = geoJson.features.map(feature => feature.properties?.NAME);
  const values = geoJson.features.map(feature => {
    const regionMatch = regionData.find(d => 
      d.adm1_psgc === feature.properties?.ADM1_PCODE || 
      d.REGION.includes(feature.properties?.NAME)
    );
    return regionMatch ? regionMatch[selectedYear] : 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        {(["2000", "2010", "2020"] as const).map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-md ${
              selectedYear === year
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      
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
              color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              width: 0.5
            }
          },
          colorbar: {
            title: 'Electrification Rate (%)',
            thickness: 10,
            tickfont: {
              color: theme === 'dark' ? '#fff' : '#000'
            },
            titlefont: {
              color: theme === 'dark' ? '#fff' : '#000'
            }
          }
        }]}
        layout={{
          title: `Philippines Electrification Rate by Region (${selectedYear})`,
          font: {
            color: theme === 'dark' ? '#fff' : '#000'
          },
          geo: {
            fitbounds: 'locations',
            projection: { type: 'mercator' },
            bgcolor: 'transparent',
            showframe: false,
            showcoastlines: false,
            showland: false,
            subunitcolor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          },
          margin: { t: 50, b: 0, l: 0, r: 0 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent'
        }}
        config={{ responsive: true }}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
}

export default PhilippinesMap;