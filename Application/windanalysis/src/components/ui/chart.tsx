"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { enGB } from 'date-fns/locale';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

interface ChartProps {
    actuals: WindDataPoint[];
    forecasts: WindDataPoint[];
    isLoading: boolean;
}

type WindDataPoint = {
    startTime: string;
    generation: number;
};

export function WindChart({ actuals, forecasts, isLoading }: ChartProps) {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(20, 33, 61, 0.92)',
                titleFont: {
                    family: "var(--font-ui), sans-serif",
                    size: 13,
                },
                bodyFont: {
                    family: "var(--font-ui), sans-serif",
                    size: 13,
                },
                padding: 12,
                cornerRadius: 10,
                displayColors: true,
                borderColor: 'rgba(148, 163, 184, 0.45)',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'hour' as const,
                    displayFormats: {
                        hour: 'HH:mm\ndd/MM/yy'
                    },
                    tooltipFormat: 'PPpp',
                },
                adapters: {
                    date: {
                        locale: enGB,
                    },
                },
                grid: {
                    color: 'rgba(100, 116, 139, 0.16)',
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        family: "var(--font-ui), sans-serif",
                        size: 12,
                    },
                    color: '#334155',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8,
                },
                title: {
                    display: true,
                    text: 'Target Time End (UTC)',
                    font: {
                        family: "var(--font-ui), sans-serif",
                        size: 14,
                        weight: 500 as const,
                    },
                    color: '#1f2937',
                    padding: { top: 10, bottom: 0 }
                }
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(100, 116, 139, 0.16)',
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        family: "var(--font-ui), sans-serif",
                        size: 12,
                    },
                    color: '#334155',
                    callback: function (value: string | number) {
                        const numericValue = typeof value === 'string' ? Number(value) : value;
                        if (Number.isNaN(numericValue)) return value;
                        return (numericValue / 1000) + 'k';
                    },
                    maxTicksLimit: 8,
                },
                title: {
                    display: true,
                    text: 'Power (MW)',
                    font: {
                        family: "var(--font-ui), sans-serif",
                        size: 14,
                        weight: 500 as const,
                    },
                    color: '#1f2937',
                    padding: { top: 0, bottom: 10 }
                }
            },
        },
        elements: {
            line: {
                tension: 0.4, // Smooth curves
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 5,
            }
        }
    };

    const data = {
        datasets: [
            {
                label: 'Actual Wind Generation',
                data: actuals.map(d => ({ x: new Date(d.startTime), y: d.generation })),
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15, 118, 110, 0.22)',
                borderWidth: 3,
                pointBackgroundColor: '#0f766e',
                fill: false,
                tension: 0.22,
            },
            {
                label: 'Forecast Wind Generation',
                data: forecasts.map(d => ({ x: new Date(d.startTime), y: d.generation })),
                borderColor: '#d97706',
                backgroundColor: 'rgba(217, 119, 6, 0.22)',
                borderWidth: 3,
                borderDash: [7, 6],
                pointBackgroundColor: '#d97706',
                fill: false,
                tension: 0.2,
            },
        ],
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-300/70 bg-linear-to-br from-[#fffaf2] via-[#fff8ed] to-[#f6f2ea]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/80 border-t-transparent"></div>
                    <p className="animate-pulse text-sm font-semibold text-slate-600">Loading generation trajectory...</p>
                </div>
            </div>
        );
    }

    if (actuals.length === 0 && forecasts.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-linear-to-br from-[#fffaf2] to-[#f2ede3]">
                <div className="text-center">
                    <p className="text-base font-semibold text-slate-700">No generation data yet</p>
                    <p className="mt-1 text-sm text-slate-500">Change the date corridor or horizon to fetch another slice.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full rounded-2xl border border-slate-300/50 bg-[#fffdf7]/90 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-4 transition-all duration-200">
            <Line options={options} data={data} className="h-full! w-full!" />
        </div>
    );
}
