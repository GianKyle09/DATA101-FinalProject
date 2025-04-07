import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import CountrySelector from "@/components/country-selector"
import CountryEnergyProfile from "@/components/country-energy-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Country Energy Profiles | Energy Statistics",
  description: "Detailed energy profiles for Philippines and ASEAN countries",
}

export default function CountriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Country Energy Profiles</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select a Country</CardTitle>
            <CardDescription>View detailed energy statistics for a specific country</CardDescription>
          </CardHeader>
          <CardContent>
            <CountrySelector />
          </CardContent>
        </Card>

        <CountryEnergyProfile />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        Energy Statistics Visualization © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

