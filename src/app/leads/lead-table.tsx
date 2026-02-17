"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Brain,
    Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function LeadTable({ initialLeads }: { initialLeads: any[] }) {
    const [leads, setLeads] = useState(initialLeads);
    const [search, setSearch] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filteredLeads = leads.filter(l =>
        l.contactName.toLowerCase().includes(search.toLowerCase()) ||
        l.city.toLowerCase().includes(search.toLowerCase())
    );

    const runAIScore = async (leadId: string) => {
        setLoadingId(leadId);
        try {
            const res = await fetch("/api/ai/score-lead", {
                method: "POST",
                body: JSON.stringify({ leadId }),
            });
            const updatedLead = await res.json();
            setLeads(leads.map(l => l.id === leadId ? updatedLead : l));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-card glass overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Lead</th>
                            <th className="px-4 py-3 text-left font-medium">Site Details</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-center font-medium">AI Score</th>
                            <th className="px-4 py-3 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-4">
                                    <p className="font-semibold">{lead.contactName}</p>
                                    <p className="text-xs text-muted-foreground">{lead.contactEmail}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p>{lead.siteType}</p>
                                    <p className="text-xs text-muted-foreground">{lead.squareMeters} sqm, {lead.frequencyPerWeek}x/wk</p>
                                </td>
                                <td className="px-4 py-4">
                                    <Badge variant="outline">{lead.status}</Badge>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {lead.aiLeadScore ? (
                                        <div className="flex flex-col items-center">
                                            <span className={`text-lg font-bold ${lead.aiLeadScore > 70 ? 'text-emerald-500' : 'text-primary'}`}>
                                                {lead.aiLeadScore}
                                            </span>
                                            {lead.suggestedQuoteMonthly && (
                                                <span className="text-[10px] font-medium text-muted-foreground">
                                                    Est. {formatCurrency(lead.suggestedQuoteMonthly)}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic text-xs">Unscored</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => runAIScore(lead.id)}
                                        disabled={loadingId === lead.id}
                                    >
                                        {loadingId === lead.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Brain className="h-4 w-4 text-emerald-500" />
                                        )}
                                        Score Lead
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
