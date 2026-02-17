"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    Settings,
    Crown,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Leads", href: "/leads", icon: Briefcase },
    { label: "Clients", href: "/clients", icon: Users },
    { label: "Jobs", href: "/jobs", icon: Calendar },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-black border-r border-white/5 flex flex-col pt-12">
            <div className="px-8 mb-16">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center p-2 shadow-lg shadow-emerald-500/20">
                        <Sparkles className="text-black h-full w-full" />
                    </div>
                    <span className="text-2xl font-black text-white italic tracking-tighter">DROPLET</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300 group",
                                isActive
                                    ? "bg-white/5 text-emerald-400"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-400" : "text-white/20 group-hover:text-white/60")} />
                            {item.label}
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500 cursor-pointer">
                    <div className="relative z-10">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                            <Crown className="h-5 w-5 text-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-white mb-1">Scale Operation</p>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">Upgrade to Pro for team expansion.</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            Upgrade Now <ChevronRight className="h-3 w-3" />
                        </div>
                    </div>
                    {/* Background glow */}
                    <div className="absolute -right-8 -bottom-8 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                </div>
            </div>
        </aside>
    );
}
