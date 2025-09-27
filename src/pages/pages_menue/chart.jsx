"use client"

import { GitCommitVertical, TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/dashbord/card"
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/dashbord/chart"
import { use, useEffect, useState } from "react"

export const description = "A line chart with custom dots"

// const chartData = [
//   { month: "Lundi", desktop: 130, mobile: 80 },
//   { month: "Mardi", desktop: 590, mobile: 200 },
//   { month: "Mercredi", desktop: 23, mobile: 120 },
//   { month: "Jeudi", desktop: 400, mobile: 190 },
//   { month: "Vendredi", desktop: 97, mobile: 130 },
//   { month: "Samadi", desktop: 77, mobile: 140 },
//   { month: "Dimanche", desktop: 40, mobile: 140 },
// ]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} 

export default function ChartLineDotsCustom() {
  const [chartData , setChartData]=useState([])
  const fetchData = async () => {
    try {
      const token = await window.electronAPI.getToken()
      if (!token) throw new Error("Token non disponible")

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/dashboard/salesGraph`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("Erreur lors de la récupération des données")
      const result = await response.json()
      setChartData(result)
      // setIsLoading(false)
      // alert(JSON.stringify(result))
    } catch (error) {
      console.error("Erreur:", error)
    }
  }
  useEffect(() => {
    fetchData()
  }
, [])

// jour actuel
 function JourActuel() {
  const today = new Date();

  const jours = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
  ];

  const jourActuel = jours[today.getDay()];

  return <h1>Aujourd'hui, on est {jourActuel}</h1>;
}

  return (
    <Card className="w-[800px] md:w-[650px]">
      <CardHeader>
        <CardTitle>Nombre de vente par jour</CardTitle>
        <CardDescription>{JourActuel()}</CardDescription>
      </CardHeader>
      <CardContent className=" ">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line className=""
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24
                return (
                  <GitCommitVertical
                    key={payload.month}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-desktop)"
                  />
                )
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Suivez levolution de votre business <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
           Les 7 dernier jours
        </div>
      </CardFooter>
    </Card>
  )
}
