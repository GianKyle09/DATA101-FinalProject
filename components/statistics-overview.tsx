"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, Droplet, Flame, Wind } from "lucide-react"

export default function StatisticsOverview() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:w-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="consumption">Consumption</TabsTrigger>
        <TabsTrigger value="production">Production</TabsTrigger>
        <TabsTrigger value="renewable">Renewable</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Energy Consumption</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245 TWh</div>
              <p className="text-xs text-muted-foreground">+5.2% from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Production</CardTitle>
              <Battery className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892 TWh</div>
              <p className="text-xs text-muted-foreground">+3.1% from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renewable Share</CardTitle>
              <Wind className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.4%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Imports</CardTitle>
              <Droplet className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">353 TWh</div>
              <p className="text-xs text-muted-foreground">-1.8% from last year</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="consumption" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Energy consumption statistics across ASEAN countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Indonesia</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">475.3 TWh</div>
                  <p className="text-xs text-muted-foreground">+6.1% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Philippines</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">115.2 TWh</div>
                  <p className="text-xs text-muted-foreground">+4.3% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Thailand</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">193.8 TWh</div>
                  <p className="text-xs text-muted-foreground">+5.7% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vietnam</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">216.7 TWh</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last year</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="production" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Energy Production</CardTitle>
            <CardDescription>Energy production statistics across ASEAN countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Indonesia</CardTitle>
                  <Battery className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">407.2 TWh</div>
                  <p className="text-xs text-muted-foreground">+4.9% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Malaysia</CardTitle>
                  <Battery className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142.8 TWh</div>
                  <p className="text-xs text-muted-foreground">+3.8% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Philippines</CardTitle>
                  <Battery className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">86.7 TWh</div>
                  <p className="text-xs text-muted-foreground">+4.1% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vietnam</CardTitle>
                  <Battery className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">185.4 TWh</div>
                  <p className="text-xs text-muted-foreground">+7.3% from last year</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="renewable" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Renewable Energy</CardTitle>
            <CardDescription>Renewable energy adoption across ASEAN countries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Laos</CardTitle>
                  <Wind className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">65.8%</div>
                  <p className="text-xs text-muted-foreground">+0.7% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Philippines</CardTitle>
                  <Wind className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.8%</div>
                  <p className="text-xs text-muted-foreground">+0.7% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vietnam</CardTitle>
                  <Wind className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">21.5%</div>
                  <p className="text-xs text-muted-foreground">+1.2% from last year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Singapore</CardTitle>
                  <Wind className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">+0.3% from last year</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
