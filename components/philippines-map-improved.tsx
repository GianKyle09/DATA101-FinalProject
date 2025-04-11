"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FeatureCollection } from 'geojson';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PhilippinesMapProps {
  data?: {
    region: string;
    value: number;
    adm1_psgc: string;
  }[];
}

function PhilippinesMap({ data = [] }: PhilippinesMapProps) {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        setIsLoading(true);
        // Load the Philippine regions GeoJSON from local file
        const response = await fetch('/data/choropleth/philippines-regions.json');
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

  // Prepare the choropleth data
  const regions = geoJson.features.map(feature => feature.properties?.adm2_en);
  const values = geoJson.features.map(feature => {
    const regionData = data.find(d => d.adm1_psgc === feature.properties?.adm1_psgc);
    return regionData ? regionData.value : 0;
  });

  return (
    <Plot
      data={[
        {
          type: 'choropleth',
          geojson: geoJson,
          locations: regions,
          z: values,
          featureidkey: 'properties.adm2_en',
          colorscale: 'Viridis',
          marker: {
            line: {
              color: 'rgba(255,255,255,0.2)',
              width: 0.5
            }
          },
          colorbar: {
            title: 'Electrification Rate',
            thickness: 10
          }
        }
      ]}
      layout={{
        title: 'Philippines Electrification Rate by Region',
        geo: {
          fitbounds: 'locations',
          projection: {
            type: 'mercator'
          },
          bgcolor: 'transparent',
          showframe: false,
          showcoastlines: false,
          showland: false,
          subunitcolor: 'rgba(255,255,255,0.2)'
        },
        margin: { t: 30, b: 0, l: 0, r: 0 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
      }}
      config={{ responsive: true }}
      style={{ width: '100%', height: '600px' }}
    />
  );
}

export default PhilippinesMap;