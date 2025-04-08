"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import ComparisonSelector from "@/components/comparison-selector"
import ComparisonChart from "@/components/comparison-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ComparisonPage() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["Philippines", "Indonesia", "Malaysia"])
  const [selectedMetric, setSelectedMetric] = useState("consumption")

  const handleComparisonUpdate = (countries: string[], metric: string) => {
    setSelectedCountries(countries)
    setSelectedMetric(metric)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Country Comparison</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Compare Countries</CardTitle>
            <CardDescription>Select countries and metrics to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <ComparisonSelector onUpdate={handleComparisonUpdate} />
          </CardContent>
        </Card>

        <ComparisonChart countries={selectedCountries} metric={selectedMetric} />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
      ASEAN PowerPulse by DATA101 - S12 Group 6 (Members: Apale, Masinda, Rayel, Sanchez) © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
