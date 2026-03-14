"use client";

import React from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface ChartProps {
    data: any[];
    title: string;
}

export function UserGrowthChart({ data }: { data: { date: string; count: number }[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-display">Tăng trưởng người dùng</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function CategoryPieChart({ data }: { data: { name: string; value: number }[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">Phân bổ Category</h3>
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: "16px", border: "none" }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function TopBlogsChart({ data }: { data: { title: string; views: number }[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-display">Bài viết xem nhiều nhất</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="title"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={100}
                            tick={{ fontSize: 10, fill: "#4b5563", fontWeight: 600 }}
                        />
                        <Tooltip
                            cursor={{ fill: "#f9fafb" }}
                            contentStyle={{ borderRadius: "16px", border: "none" }}
                        />
                        <Bar
                            dataKey="views"
                            fill="#8b5cf6"
                            radius={[0, 10, 10, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function BlogGrowthChart({ data }: { data: { date: string; count: number }[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold text-gray-900 mb-6 font-display">Bài viết theo ngày</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: "16px", border: "none" }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#10b981"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
