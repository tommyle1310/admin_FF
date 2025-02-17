import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



const data = [
    {
        metric: "Average Delivery Time",
        value: "30 minutes",
        changePercent: 0.05,
        description: "Average time taken for delivery",
        isPositiveChange: false,
    },
    {
        metric: "Overall Customer Satisfaction",
        value: "4.5/5",
        changePercent: -0.02,
        description: "Aggregate rating based on customer feedback",
        isPositiveChange: false,
    },
    {
        metric: "Churn Rate",
        value: "5%",
        changePercent: 0.01,
        description: "Percentage of users who are not active for 1 month",
        isPositiveChange: false,
    },
    {
        metric: "Order Cancellation Rate",
        value: "8%",
        changePercent: -0.03,
        description: "Percentage of orders canceled before delivery",
        isPositiveChange: true,
    },
    {
        metric: "Order Volume",
        value: "1,500 Orders",
        changePercent: 0.2,
        description: "Total number of orders placed withing a specific timeframe",
        isPositiveChange: true,
    }
]

export function DashboardTable() {
    return (
        <Table className="overflow-hidden card">
            <TableCaption>Statistics of some essential performance to evaluate the Flashfood health.</TableCaption>
            <TableHeader className="bg-info-100 ">
                <TableRow className="font-semibold">
                    <TableHead >Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Change (%)</TableHead>
                    <TableHead >Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.metric}>
                        <TableCell className="font-medium text-primary-700">{item.metric}</TableCell>
                        <TableCell className="font-bold">{item.value}</TableCell>
                        <TableCell className={`${item.isPositiveChange ? "text-success-700" : 'text-danger-500'}`}>{`${item.changePercent > 0 ? '+' : ''}${(item.changePercent * 100).toFixed(2)}%`}</TableCell>
                        <TableCell className='text-neutral-500'>{item.description}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
