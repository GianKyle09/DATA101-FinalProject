"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import CountrySelector from "@/components/country-selector"
import CountryEnergyProfile from "@/components/country-energy-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CountriesPage() {
  const [selectedCountry, setSelectedCountry] = useState("philippines")

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country.toLowerCase())
  }

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
            <CountrySelector onCountryChange={handleCountryChange} />
          </CardContent>
        </Card>

        <CountryEnergyProfile country={selectedCountry} />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
      ASEAN PowerPulse by DATA101 - S12 Group 6 (Members: Apale, Masinda, Rayel, Sanchez) © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
