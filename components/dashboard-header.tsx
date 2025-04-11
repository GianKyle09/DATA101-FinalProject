"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, Map, Menu, X } from "lucide-react"
import { useState } from "react"

export default function DashboardHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Comparison", href: "/comparison", icon: LineChart },
    { name: "Philippines", href: "/philippines", icon: Map },
  ]

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <BarChart3 className="h-6 w-6 mr-2" />
              <span className="font-bold text-lg">DATA101 - S12 Group 6</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
