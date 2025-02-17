"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { MdSaveAlt } from "react-icons/md";


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

export const description = "A multiple line chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function UserGrowthRateChart() {
    return (
        <Card className="shadcn-card-default">
            <div className="jb gap-2">
                <div className="fc gap-1">
                    <CardTitle>User Growth Rate</CardTitle>
                    <CardDescription className="font-thin text-xs text-neutral-400">
                        User growth rate measures the percentage increase in active users over a specified period.
                    </CardDescription>
                </div>
                <Button variant={'outline'} className="text-primary-500 border-primary-500 font-bold flex items-center gap-1"><MdSaveAlt /> Save Report</Button>
            </div>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
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
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="desktop"
                            type="monotone"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="mobile"
                            type="monotone"
                            stroke="var(--color-mobile)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
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
