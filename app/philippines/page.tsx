import PhilippinesMap from "@/components/philippines-map-improved"
import DashboardHeader from "@/components/dashboard-header"

export default function PhilippinesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Philippines Electrification Rate</h1>
        <PhilippinesMap />
      </main>
      <footer className="border-t py-4 text-center text-sm text-gray-500">
        DATA101 - S12 Group 6 (Members: Apale, Masinda, Rayel, Sanchez) © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
