"use client";

import { useEffect, useState } from "react";

interface ControlsProps {
    onSearch: (startDate: string, endDate: string, horizon: number) => void;
    isLoading: boolean;
}

export function Controls({ onSearch, isLoading }: ControlsProps) {
    // Defaulting to Jan 2024 to fetch actual historical records without issue
    const maxRangeDays = 30;
    const maxRangeMs = maxRangeDays * 24 * 60 * 60 * 1000;

    const [startStr, setStartStr] = useState("2024-01-01T00:00");
    const [endStr, setEndStr] = useState("2024-01-02T00:00");
    const [horizon, setHorizon] = useState(4);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (startStr && endStr) {
                const s = new Date(`${startStr}:00Z`);
                let e = new Date(`${endStr}:00Z`);

                if (isNaN(s.getTime()) || isNaN(e.getTime())) return;

                // Sync bounds to prevent API timeouts if the user accidentally requests a huge timeframe
                if (e < s) {
                    e = new Date(s.getTime() + 24 * 60 * 60 * 1000);
                    setEndStr(e.toISOString().slice(0, 16));
                } else if (e.getTime() - s.getTime() > maxRangeMs) {
                    e = new Date(s.getTime() + maxRangeMs);
                    setEndStr(e.toISOString().slice(0, 16));
                }

                onSearch(s.toISOString(), e.toISOString(), horizon);
            }
        }, 1500); // 1.5s debounce
        return () => clearTimeout(timer);
    }, [startStr, endStr, horizon, onSearch]);

    return (
        <div className="w-full rounded-3xl border border-slate-300/70 bg-[#fffaf0]/75 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Control deck</p>
                <p className="text-xs text-slate-500">Max window {maxRangeDays} days</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(300px,1fr)] md:items-end">
                <div className="flex flex-col">
                    <label htmlFor="startStr" className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                        Start time (UTC)
                    </label>
                    <input
                        type="datetime-local"
                        id="startStr"
                        value={startStr}
                        onChange={(e) => setStartStr(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white/95 px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="endStr" className="mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                        End time (UTC)
                    </label>
                    <input
                        type="datetime-local"
                        id="endStr"
                        value={endStr}
                        onChange={(e) => setEndStr(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white/95 px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15"
                    />
                </div>

                <div className="flex flex-col rounded-2xl border border-slate-300/70 bg-white/70 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <label htmlFor="horizon" className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                            Forecast horizon
                        </label>
                        <span className="rounded-full border border-amber-700/30 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-900">{horizon}h</span>
                    </div>
                    <input
                        type="range"
                        id="horizon"
                        min="1"
                        max="48"
                        value={horizon}
                        onChange={(e) => setHorizon(parseInt(e.target.value))}
                        className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-300/70 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                        style={{ accentColor: '#d97706' }}
                    />
                    <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
                        <span>1h</span>
                        <span>24h</span>
                        <span>48h</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300/80 bg-white/60 px-3 py-2 text-xs text-slate-600">
                {isLoading
                    ? "Refreshing corridor and forecast layers..."
                    : "Updates run automatically 1.5 seconds after you edit time or horizon."}
            </div>
        </div>
    );
}
