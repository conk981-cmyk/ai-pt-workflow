"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Users,
    Sparkles,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function JobView({ initialJobs, teams }: { initialJobs: any[], teams: any[] }) {
    const [jobs, setJobs] = useState(initialJobs);
    const [optimizing, setOptimizing] = useState(false);
    const [proposal, setProposal] = useState<any[] | null>(null);

    const suggestSchedule = async () => {
        setOptimizing(true);
        try {
            const res = await fetch("/api/jobs/suggest-schedule", {
                method: "POST",
                body: JSON.stringify({ date: new Date().toISOString() }),
            });
            const data = await res.json();
            setProposal(data.proposal);
        } catch (err) {
            console.error(err);
        } finally {
            setOptimizing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={suggestSchedule} disabled={optimizing} className="gap-2">
                    {optimizing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    AI Suggest Optimization
                </Button>
            </div>

            {proposal && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Scheduling Proposal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {proposal.map((p: any, i: number) => (
                                <div key={i} className="bg-background p-3 rounded-lg border shadow-sm">
                                    <p className="font-semibold text-sm">{p.jobName}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {p.county}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground line-through">Team {p.originalTeamId?.slice(-4) || 'Unassigned'}</span>
                                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> {p.suggestedTeamName}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setProposal(null)}>Discard</Button>
                            <Button size="sm">Apply optimization</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {jobs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                        No upcoming jobs found.
                    </div>
                ) : (
                    jobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-primary/10 p-4 flex flex-col items-center justify-center min-w-[120px] border-r">
                                    <span className="text-2xl font-bold">{new Date(job.date).getDate()}</span>
                                    <span className="text-xs uppercase font-medium text-muted-foreground">
                                        {new Date(job.date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="flex-1 p-4 grid gap-4 md:grid-cols-3">
                                    <div>
                                        <h3 className="font-bold">{job.client.name}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> {job.client.city}, {job.client.county}
                                        </p>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(job.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({job.durationMinutes}m)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>{job.team?.name || 'Unassigned'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <Badge variant={job.status === 'COMPLETED' ? 'success' : 'outline'}>
                                            {job.status}
                                        </Badge>
                                        <span className="font-bold text-lg">{formatCurrency(job.priceCharged)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
