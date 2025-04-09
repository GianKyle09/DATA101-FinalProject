import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import StatisticsOverview from "@/components/statistics-overview"
import EnergyMap from "@/components/energy-map"
import ConsumptionChart from "@/components/consumption-chart"
import ProductionChart from "@/components/production-chart"
import RenewableEnergyChart from "@/components/renewable-energy-chart"
// Import the fixed map component
import PhilippinesMap from "@/components/philippines-map-improved"

export const metadata: Metadata = {
  title: "DATA101 - S12 Group 6 | ASEAN PowerPulse",
  description:
    "Comprehensive visualization of energy statistics across Philippines and ASEAN countries by DATA101 - S12 Group 6",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">ASEAN PowerPulse Energy Dashboard</h1>

        <StatisticsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="col-span-1 lg:col-span-2 mb-6">
            <PhilippinesMap />
          </div>
          <div className="col-span-1 lg:col-span-2 mb-6">
            <EnergyMap />
          </div>
          <ConsumptionChart />
          <ProductionChart />
          <div className="col-span-1 lg:col-span-2 mt-6">
            <RenewableEnergyChart />
          </div>
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
      ASEAN PowerPulse by DATA101 - S12 Group 6 (Members: Apale, Masinda, Rayel, Sanchez) © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
