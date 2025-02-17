"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { MdSaveAlt } from "react-icons/md";


export const description = "A simple area chart"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: '#c19ef8',
    },
} satisfies ChartConfig

export function NetRevenueChart() {
    return (
        <Card className="shadcn-card-default">
            <div className="jb gap-2">
                <div className="fc gap-1">
                    <CardTitle>Net Revenue</CardTitle>
                    <CardDescription className="font-thin text-xs text-neutral-400">
                        Net revenue is total income minus returns, discounts, and allowances, showing actual earnings.
                    </CardDescription>
                </div>
                <Button variant={'outline'} className="text-primary-500 border-primary-500 font-bold flex items-center gap-1"><MdSaveAlt /> Save Report</Button>
            </div>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
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
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by <span className="text-success-700 font-bold">5.2%</span> this month <TrendingUp className="h-4 w-4 text-success-700 font-bold" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            <span className="link-date-hover text-info-700">January 2024</span>  -  <span className="link-date-hover text-info-700">June 2024</span>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
