"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 120,
  },
  {
    name: "Feb",
    total: 145,
  },
  {
    name: "Mar",
    total: 168,
  },
  {
    name: "Apr",
    total: 152,
  },
  {
    name: "May",
    total: 187,
  },
  {
    name: "Jun",
    total: 210,
  },
  {
    name: "Jul",
    total: 245,
  },
  {
    name: "Aug",
    total: 262,
  },
  {
    name: "Sep",
    total: 248,
  },
  {
    name: "Oct",
    total: 275,
  },
  {
    name: "Nov",
    total: 305,
  },
  {
    name: "Dec",
    total: 342,
  },
]

export function OrdersChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="currentColor" strokeWidth={2} className="stroke-primary" />
      </LineChart>
    </ResponsiveContainer>
  )
}

