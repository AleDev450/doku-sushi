"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const reservas = [
  { mes: "Ene", reservas: 180 }, { mes: "Feb", reservas: 210 },
  { mes: "Mar", reservas: 240 }, { mes: "Abr", reservas: 280 },
  { mes: "May", reservas: 320 }, { mes: "Jun", reservas: 410 },
  { mes: "Jul", reservas: 468 },
];

const ventas = [
  { cat: "Makis", total: 42 }, { cat: "Nigiris", total: 31 },
  { cat: "Entradas", total: 24 }, { cat: "Calientes", total: 28 },
  { cat: "Postres", total: 16 }, { cat: "Bebidas", total: 21 },
];

const tooltipStyle = {
  background: "#141414",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

export function ReservasChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={reservas} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E30613" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#E30613" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="mes" stroke="rgba(255,255,255,0.34)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.34)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
        <Area type="monotone" dataKey="reservas" stroke="#E30613" strokeWidth={2.5} fill="url(#g)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function VentasChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={ventas} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="cat" stroke="rgba(255,255,255,0.34)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.34)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {ventas.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#E30613" : "#3a1113"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
