import type { Metadata } from "next"
import DashboardHeader from "@/components/dashboard-header"
import ComparisonSelector from "@/components/comparison-selector"
import ComparisonChart from "@/components/comparison-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Country Comparison | DATA101 - S12 Group 6",
  description: "Compare energy statistics between Philippines and ASEAN countries by DATA101 - S12 Group 6",
}

export default function ComparisonPage() {
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
            <ComparisonSelector />
          </CardContent>
        </Card>

        <ComparisonChart />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        DATA101 - S12 Group 6 (Members: Apale, Masinda, Rayel, Sanchez) © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

