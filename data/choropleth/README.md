# Choropleth Map Setup

To make the Philippines choropleth map work, please upload your GeoJSON files to this directory.

## Required Files

1. `philippines-regions.json` - The main GeoJSON file containing the Philippines regions

## File Structure

The GeoJSON file should have the following structure:

\`\`\`json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "properties": {
        "adm1_psgc": "numeric_id",
        "adm2_en": "region_name",
        ...
      }
    },
    ...
  ]
}
\`\`\`

The `adm1_psgc` property in the GeoJSON should match the `adm1_psgc` field in the region data to properly link the data to the map regions.
