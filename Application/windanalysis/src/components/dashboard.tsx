"use client";

import { useState, useCallback } from "react";
import { Controls } from "./ui/controls";
import { WindChart } from "./ui/chart";

type WindDataPoint = {
    startTime: string;
    generation: number;
};

export function Dashboard() {
    const [actuals, setActuals] = useState<WindDataPoint[]>([]);
    const [forecasts, setForecasts] = useState<WindDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWithTimeout = useCallback(async (url: string, timeoutMs = 20000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
                let message = `Request failed with status ${response.status}`;
                try {
                    const body = await response.json();
                    if (body?.error && typeof body.error === "string") {
                        message = body.error;
                    }
                } catch {
                    // Ignore non-JSON error payloads.
                }
                throw new Error(message);
            }

            return response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }, []);

    const fetchData = useCallback(async (startIso: string, endIso: string, horizon: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const [actualsResult, forecastsResult] = await Promise.allSettled([
                fetchWithTimeout(`/api/actuals?start=${startIso}&end=${endIso}`),
                fetchWithTimeout(`/api/forecasts?start=${startIso}&end=${endIso}&horizon=${horizon}`)
            ]);

            const actualsPayload = actualsResult.status === "fulfilled" ? actualsResult.value : [];
            const forecastsPayload = forecastsResult.status === "fulfilled" ? forecastsResult.value : [];

            const actualsData = Array.isArray(actualsPayload) ? actualsPayload : [];
            const forecastsData = Array.isArray(forecastsPayload) ? forecastsPayload : [];

            setActuals(actualsData);
            setForecasts(forecastsData);

            if (actualsData.length === 0 && forecastsData.length === 0) {
                const errorMessages = [actualsResult, forecastsResult]
                    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
                    .map((result) => result.reason instanceof Error ? result.reason.message : "Unknown API error");

                if (errorMessages.length > 0) {
                    throw new Error(errorMessages.join(" | "));
                }
            }
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error && err.name === "AbortError") {
                setError("Request timed out. Please try a shorter date range or retry.");
            } else {
                setError(err instanceof Error ? err.message : "An error occurred while fetching data.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [fetchWithTimeout]);

    const handleSearch = useCallback((start: string, end: string, horizon: number) => {
        fetchData(start, end, horizon);
    }, [fetchData]);

    const forecastCoverage = actuals.length > 0 ? Math.round((forecasts.length / actuals.length) * 100) : 0;

    return (
        <div className="mx-auto mt-2 grid w-full gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <section className="panel-surface fade-rise rounded-[28px] p-6 md:p-8 lg:col-span-2">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-emerald-800">
                            National Grid Intelligence
                        </div>
                        <h1
                            className="mt-4 text-3xl leading-tight text-slate-900 sm:text-4xl"
                            style={{ fontFamily: "var(--font-display), serif" }}
                        >
                            UK Wind Power Atlas
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                            Explore live wind generation against forecast snapshots over your selected time corridor.
                            Adjust the window and horizon to reveal how prediction quality evolves over time.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        <article className="rounded-2xl border border-slate-300/60 bg-white/75 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">Stream status</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{isLoading ? "Syncing latest values" : "Synchronized"}</p>
                        </article>
                        <article className="rounded-2xl border border-slate-300/60 bg-white/75 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">Actual points</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{actuals.length}</p>
                        </article>
                        <article className="rounded-2xl border border-slate-300/60 bg-white/75 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-slate-500">Forecast coverage</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{forecastCoverage}%</p>
                        </article>
                    </div>
                </div>

                <div className="mt-6">
                    <Controls onSearch={handleSearch} isLoading={isLoading} />
                </div>

                {error && (
                    <div className="mt-4 rounded-2xl border border-red-300/70 bg-red-50/90 p-4">
                        <div className="flex items-start gap-3">
                            <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-red-600" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-900">Data sync warning</h3>
                                <p className="mt-1 text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="panel-surface fade-rise stagger-1 w-full rounded-[28px] p-5 sm:p-6 lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2
                        className="text-xl text-slate-900 sm:text-2xl"
                        style={{ fontFamily: "var(--font-display), serif" }}
                    >
                        Generation Trajectory
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 sm:text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/25 bg-emerald-500/10 px-3 py-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                            Actual
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-700/25 bg-orange-500/10 px-3 py-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                            Forecast
                        </span>
                    </div>
                </div>

                <div className="h-135 w-full rounded-3xl border border-slate-300/60 bg-white/70 p-2 sm:p-3">
                    <WindChart
                        actuals={actuals}
                        forecasts={forecasts}
                        isLoading={isLoading}
                    />
                </div>
            </section>
        </div>
    );
}
