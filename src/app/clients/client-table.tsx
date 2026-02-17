"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    AlertTriangle,
    ChevronRight,
    Loader2,
    Activity
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function ClientTable({ initialClients }: { initialClients: any[] }) {
    const [clients, setClients] = useState(initialClients);
    const [search, setSearch] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );

    const runChurnCheck = async (clientId: string) => {
        setLoadingId(clientId);
        try {
            const res = await fetch("/api/ai/churn-check", {
                method: "POST",
                body: JSON.stringify({ clientId }),
            });
            const updatedClient = await res.json();
            setClients(clients.map(c => c.id === clientId ? updatedClient : c));
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
                        placeholder="Search clients by name or city..."
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
                            <th className="px-4 py-3 text-left font-medium">Client</th>
                            <th className="px-4 py-3 text-left font-medium">Location</th>
                            <th className="px-4 py-3 text-left font-medium">Monthly Value</th>
                            <th className="px-4 py-3 text-center font-medium">Churn Risk</th>
                            <th className="px-4 py-3 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {filteredClients.map((client) => {
                            const isHighRisk = client.churnRisk >= 70;
                            return (
                                <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="font-semibold">{client.name}</p>
                                        <p className="text-xs text-muted-foreground">Since {new Date(client.startDate).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p>{client.city}</p>
                                        <p className="text-xs text-muted-foreground">{client.county}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-emerald-600">{formatCurrency(client.contractMonthlyValue)}</p>
                                        <p className="text-xs text-muted-foreground">{client.contractFrequencyPerWeek}x per week</p>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`text-lg font-bold ${isHighRisk ? 'text-destructive' : 'text-primary'}`}>
                                                {client.churnRisk}%
                                            </div>
                                            {isHighRisk && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                            onClick={() => runChurnCheck(client.id)}
                                            disabled={loadingId === client.id}
                                        >
                                            {loadingId === client.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Activity className="h-4 w-4 text-primary" />
                                            )}
                                            Run Check
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
