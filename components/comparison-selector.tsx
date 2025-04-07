"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function ComparisonSelector() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["Philippines", "Indonesia", "Malaysia"])
  const [metric, setMetric] = useState("consumption")

  const countries = [
    "Philippines",
    "Indonesia",
    "Malaysia",
    "Thailand",
    "Vietnam",
    "Singapore",
    "Brunei",
    "Cambodia",
    "Laos",
    "Myanmar",
  ]

  const handleCountryChange = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Select Countries</h3>
        <div className="grid grid-cols-2 gap-2">
          {countries.map((country) => (
            <div key={country} className="flex items-center space-x-2">
              <Checkbox
                id={`country-${country}`}
                checked={selectedCountries.includes(country)}
                onCheckedChange={() => handleCountryChange(country)}
              />
              <Label htmlFor={`country-${country}`}>{country}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Select Metric</h3>
        <RadioGroup value={metric} onValueChange={setMetric}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="consumption" id="consumption" />
            <Label htmlFor="consumption">Energy Consumption</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="production" id="production" />
            <Label htmlFor="production">Energy Production</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="renewable" id="renewable" />
            <Label htmlFor="renewable">Renewable Share</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intensity" id="intensity" />
            <Label htmlFor="intensity">Energy Intensity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="emissions" id="emissions" />
            <Label htmlFor="emissions">CO2 Emissions</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="md:col-span-2">
        <Separator className="my-4" />
        <Button>Update Comparison</Button>
      </div>
    </div>
  )
}

