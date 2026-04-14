"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface AdminRevenueChartProps {
  data: { date: string; revenue: number }[];
}

export function AdminRevenueChart({ data }: AdminRevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No revenue data for this period.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="#F5F5F7" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#6B7280", fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 10, fill: "#6B7280", fontWeight: 700 }}
          tickLine={false}
          axisLine={false}
          width={55}
        />
        <Tooltip
          contentStyle={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "1rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            fontSize: "12px",
            fontWeight: "bold",
          }}
          formatter={(value: any) => [formatPrice(Number(value) || 0), "Revenue"]}
          labelStyle={{ color: "#1A1A1A", marginBottom: "4px" }}
          cursor={{ stroke: "#1A1A1A", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#1A1A1A"
          strokeWidth={4}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{ r: 6, fill: "#D4AF37", stroke: "#FFFFFF", strokeWidth: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
