import { db as prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart3,
    TrendingUp,
    UserPlus,
    Clock,
    AlertTriangle,
    Euro,
    Users,
    Search,
    Bell,
    ChevronRight,
    ArrowUpRight,
    Sparkles
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    // Fetch stats
    const completedJobs = await prisma.job.findMany({
        where: { status: 'COMPLETED' },
    });

    const totalRevenue = completedJobs.reduce((sum, job) => sum + job.priceCharged, 0);
    const avgMarginPct = completedJobs.length > 0
        ? (completedJobs.reduce((sum, job) => sum + job.marginPct, 0) / completedJobs.length)
        : 0;

    const totalLeads = await prisma.lead.count();
    const wonLeads = await prisma.lead.count({ where: { status: 'WON' } });
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    const timesheets = await prisma.timesheet.findMany();
    const totalOvertime = timesheets.reduce((sum, ts) => sum + ts.overtimeHours, 0);

    const underpricedJobs = await prisma.job.findMany({
        where: { marginPct: { lt: 20 }, status: 'COMPLETED' },
        include: { client: true },
        orderBy: { marginPct: 'asc' },
        take: 3
    });

    const highRiskClients = await prisma.client.findMany({
        where: { churnRisk: { gte: 70 } },
        orderBy: { churnRisk: 'desc' },
        take: 3
    });

    const stats = [
        { name: "Total Revenue", value: formatCurrency(totalRevenue), icon: Euro, change: "+12.5%", color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { name: "Avg. Margin", value: formatPercent(avgMarginPct), icon: TrendingUp, change: "+3.2%", color: "text-blue-400", bg: "bg-blue-400/10" },
        { name: "Conversion", value: formatPercent(conversionRate), icon: UserPlus, change: "+5.1%", color: "text-purple-400", bg: "bg-purple-400/10" },
        { name: "Overtime", value: `${totalOvertime}h`, icon: Clock, change: "-2.4%", color: "text-orange-400", bg: "bg-orange-400/10" },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-12">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gradient italic tracking-tighter">DASHBOARD</h1>
                    <p className="text-white/40 text-sm font-medium tracking-wide mt-1 uppercase">Operations Overview • LIVE DATA</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                        <input
                            placeholder="Search operations..."
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 w-64 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
                            <Bell className="h-5 w-5 text-white/60" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" />
                        </button>
                        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-none">Admin User</p>
                                <p className="text-xs text-white/40 mt-1">Operations Lead</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                <Users className="h-5 w-5 text-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="group relative overflow-hidden p-6 rounded-[2rem] bg-black border border-white/5 hover:border-white/10 transition-all duration-500 card-glow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                <ArrowUpRight className="h-3 w-3" />
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white/40 tracking-wider uppercase">{stat.name}</p>
                            <div className="text-3xl font-black text-white mt-1 tracking-tight">{stat.value}</div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <stat.icon className="h-32 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Revenue Breakdown / Chart Area (Placeholder for visual aesthetic) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-black border border-white/5 relative overflow-hidden h-[400px]">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Revenue Analytics</h3>
                                <p className="text-sm text-white/40">Monthly performance metrics</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-bold">Revenue</button>
                                <button className="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10">Cost</button>
                            </div>
                        </div>
                        {/* Custom Visual for Chart */}
                        <div className="relative h-64 flex items-end justify-between gap-4 px-4 pt-10 mt-10">
                            {[40, 60, 45, 90, 65, 85, 70, 95, 55, 75, 50, 80].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 rounded-t-lg transition-all duration-700 relative overflow-hidden"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/0 to-emerald-500/20" />
                                    </div>
                                    <div className="text-[10px] text-white/20 mt-3 font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        M{i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lower Sections */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Top Performers / Recent */}
                        <div className="p-6 rounded-[2rem] bg-black border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-lg text-white">Top Clients</h4>
                                <button className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:underline">
                                    View All <ChevronRight className="h-3 w-3" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {highRiskClients.map((client) => (
                                    <div key={client.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 font-bold group-hover:text-white transition-colors">
                                            {client.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{client.name}</p>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{client.county}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn(
                                                "text-xs font-bold px-2 py-0.5 rounded-full border inline-block",
                                                client.churnRisk! > 85 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                            )}>
                                                {client.churnRisk}% Risk
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-black border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-lg text-white">Efficiency Alerts</h4>
                                <AlertTriangle className="h-4 w-4 text-orange-400" />
                            </div>
                            <div className="space-y-4">
                                {underpricedJobs.map((job) => (
                                    <div key={job.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-bold text-white uppercase tracking-tighter truncate max-w-[120px]">{job.client.name}</p>
                                            <span className="text-[10px] font-black text-orange-400">{formatPercent(job.marginPct)} Margin</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <p className="text-[10px] text-white/40">{new Date(job.date).toLocaleDateString()}</p>
                                            <p className="text-sm font-black text-white">{formatCurrency(job.priceCharged)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Detail Area */}
                <div className="space-y-6">
                    <div className="p-6 rounded-[2rem] bg-emerald-500 overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-black font-black text-2xl tracking-tighter mb-2">AI OPERATIONS</h3>
                            <p className="text-black/60 text-sm font-bold mb-6 italic leading-snug">
                                "Predictive analysis suggests optimizing 4 routes in the South East to increase margin by 12%."
                            </p>
                            <button className="w-full py-3 bg-black text-white text-xs font-black rounded-xl uppercase tracking-widest hover:bg-black/80 transition-all">
                                Apply Solution
                            </button>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -right-10 -top-10 h-32 w-32 bg-white/20 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                        <Sparkles className="absolute right-4 bottom-4 h-16 w-16 text-black/5" />
                    </div>

                    <div className="p-6 rounded-[2rem] bg-black border border-white/5">
                        <h4 className="font-bold text-white mb-6">Recent Activity</h4>
                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                            {[
                                { title: "Lead Converted", desc: "Gold Coast Ent.", time: "2h ago", color: "bg-emerald-500" },
                                { title: "Profit Alert", desc: "Margin dip in Zone B", time: "5h ago", color: "bg-orange-500" },
                                { title: "Report Ready", desc: "Weekly Ops Digest", time: "1d ago", color: "bg-blue-500" },
                            ].map((item, i) => (
                                <div key={i} className="relative">
                                    <div className={cn("absolute -left-[1.625rem] top-1.5 w-2.5 h-2.5 rounded-full border-4 border-black", item.color)} />
                                    <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                                    <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                                    <p className="text-[10px] text-white/20 mt-2 font-bold uppercase">{item.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center py-12 group hover:border-emerald-500/40 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="h-6 w-6 text-white/20 group-hover:text-emerald-400" />
                        </div>
                        <p className="text-sm font-bold text-white/40 group-hover:text-white transition-colors">Add Widget</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Plus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
