import { Github, HardDrive } from "lucide-react";

const LINKS = {
    githubProfile: "#",
    resumeDrive: "#",
    repository: "#",
};

export function Header() {
    return (
        <header className="panel-surface fade-rise rounded-[28px] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Built by</p>
                    <h2
                        className="mt-1 text-2xl text-slate-900 sm:text-3xl"
                        style={{ fontFamily: "var(--font-display), serif" }}
                    >
                        Rishabh Jangid
                    </h2>
                </div>

                <nav className="flex items-center gap-2 sm:gap-3" aria-label="Profile and project links">
                    <a
                        href={"https://drive.google.com/file/d/1LhsGEmIIxW9Nyx4gFX-cJqvVO2lL3HMq/view?usp=sharing"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                    >
                        <HardDrive className="h-4 w-4" />
                        Resume
                    </a>

                    <a
                        href={"https://github.com/Rishabh893/REintAI"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Project repository"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 text-slate-800 transition hover:bg-white"
                    >
                        <Github className="h-5 w-5" />
                    </a>
                </nav>
            </div>
        </header>
    );
}
