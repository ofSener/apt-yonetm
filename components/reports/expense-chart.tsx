// components/reports/expense-chart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ExpenseData {
  month: string;
  amount: number;
}

export function ExpenseChart({ data }: { data: ExpenseData[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#3b82f6" name="Harcama (₺)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}