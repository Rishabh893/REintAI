import { Dashboard } from "../components/dashboard";
import { Header } from "../components/header";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 md:py-10">
            <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 top-40 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />

            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5">
                <Header />
                <Dashboard />
            </div>
        </main>
    );
}
