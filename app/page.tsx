import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import ConsumptionChart from "@/components/consumption-chart"
import ProductionChart from "@/components/production-chart"
import EnergyMap from "@/components/energy-map"

export const metadata: Metadata = {
  title: "DATA101 - S12 Group 6 | Energy Statistics Dashboard",
  description:
    "Comprehensive visualization of energy statistics across Philippines and ASEAN countries by DATA101 - S12 Group 6",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">ASEAN PowerPulse</h1>

        <div className="mb-6">
          <EnergyMap />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ConsumptionChart />
          <ProductionChart />
        </div>
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        DATA101 - S12 Group 6 (Members: Apale, Masinda, Rayel, Sanchez) © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
