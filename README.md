# ASEAN PowerPulse - Energy Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-13.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38b2ac)](https://tailwindcss.com/)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-2.24-3f4f75)](https://plotly.com/javascript/)

![ASEAN PowerPulse Dashboard Preview](https://via.placeholder.com/800x400?text=ASEAN+PowerPulse+Dashboard)

A comprehensive energy data visualization dashboard for ASEAN countries, created by DATA101 - S12 Group 6.

## 🌟 Features

- **Interactive Maps**: Choropleth visualizations of energy metrics across ASEAN and Philippine regions
- **Comparative Analysis**: Tools to compare energy statistics across different countries
- **Country Profiles**: Detailed energy profiles for each ASEAN nation
- **Multi-Chart Visualizations**: Bar charts, pie charts, line charts, radar charts, and scatter plots
- **Dark/Light Mode**: Full theme support for all visualizations
- **Responsive Design**: Mobile-friendly interface adapting to all screen sizes

## 📋 Contents

- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Data Sources](#data-sources)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## 🚀 Demo

[Live Demo](https://asean-powerpulse.vercel.app) (Coming Soon)

## 💻 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/asean-powerpulse.git
   cd asean-powerpulse
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔍 Usage

The dashboard is organized into three main sections:

1. **Dashboard**: The home page provides an overview of energy statistics across ASEAN, featuring:
   - Philippines Electrification Rate Map
   - ASEAN Energy Map
   - Energy Consumption Trends
   - Energy Production Mix
   - Renewable Energy Analysis

2. **Country Profiles**: Detailed energy statistics for individual ASEAN countries:
   - Energy Balance (Production, Imports, Exports, Consumption)
   - Historical Energy Data
   - Energy Forecasts

3. **Comparison**: Tools to compare different countries and metrics:
   - Select multiple countries to compare
   - Choose from various energy metrics
   - Toggle between different chart types (Bar, Radar, Scatter)

## 🛠️ Technologies

- **Frontend Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Visualization**: Plotly.js
- **Theme Management**: next-themes

## 📁 Project Structure

```
├── app/                  # Next.js app directory
│   ├── countries/        # Country profiles page
│   ├── comparison/       # Comparison page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components from shadcn/ui
│   ├── consumption-chart.tsx
│   ├── country-energy-profile.tsx
│   ├── energy-map.tsx
│   └── ...               # Other components
├── data/                 # Data files
│   ├── asean-data.js
│   ├── comparison-data.js
│   ├── consumption-data.js
│   └── ...               # Other data files
├── hooks/                # Custom React hooks
│   └── use-theme-detector.ts
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── data/choropleth/  # GeoJSON files
└── ...                   # Config files
```

## 📊 Data Sources

The dashboard uses real data from sources such as:

- International Energy Agency (IEA)
- ASEAN Centre for Energy (ACE)
- Department of Energy Philippines
- World Bank Energy Data
- BP Statistical Review of World Energy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Team

DATA101 - S12 Group 6:
- Apale
- Masinda
- Rayel
- Sanchez

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed as a final project for DATA101 at De La Salle University - Manila.
