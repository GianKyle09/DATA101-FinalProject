"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FeatureCollection } from 'geojson';
import { useTheme } from "next-themes";
import { regionData } from '@/data/region-elecrate-year-code';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface RegionData {
  COUNTRY: string;
  "ISLAND GROUP": string;
  REGION: string;
  "ELECTRIFICATION RATE": string;
  YEAR: string;
  adm1_psgc: string;
}

function PhilippinesMap() {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/macoymejia/geojsonph/master/Regions/Regions.json'
        );
        const data = await response.json();
        
        // Transform the data to match our expected structure
        const transformedData = {
          ...data,
          features: data.features.map((feature: any) => ({
            ...feature,
            properties: {
              ...feature.properties,
              adm1_psgc: feature.properties.ADM1_PCODE || feature.properties.REGION_ID,
              adm2_en: feature.properties.NAME || feature.properties.REGION
            }
          }))
        };
        
        setGeoJson(transformedData);
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

  // Prepare the data for the map
  const regions = geoJson.features.map(feature => feature.properties?.adm2_en);
  const values = geoJson.features.map(feature => {
    const regionMatch = regionData.find(d => 
      d.adm1_psgc === feature.properties?.adm1_psgc ||
      d.REGION.includes(feature.properties?.adm2_en)
    );
    return regionMatch ? parseFloat(regionMatch["ELECTRIFICATION RATE"]) * 100 : 0;
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
        }
      ]}
      layout={{
        title: 'Philippines Electrification Rate by Region',
        font: {
          color: theme === 'dark' ? '#fff' : '#000'
        },
        geo: {
          fitbounds: 'locations',
          projection: {
            type: 'mercator'
          },
          bgcolor: 'transparent',
          showframe: false,
          showcoastlines: false,
          showland: false,
          subunitcolor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
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