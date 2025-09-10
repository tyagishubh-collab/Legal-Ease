'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

type RiskDistributionChartProps = {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
};

const chartConfig = {
  value: {
    label: 'Clauses',
  },
  'Low Risk': {
    label: 'Low Risk',
    color: 'hsl(var(--chart-5))',
  },
  'Medium Risk': {
    label: 'Medium Risk',
    color: 'hsl(var(--chart-4))',
  },
  'High Risk': {
    label: 'High Risk',
    color: 'hsl(var(--chart-3))',
  },
};

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>
          Breakdown of clauses by identified risk level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%">
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-mt-2"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
