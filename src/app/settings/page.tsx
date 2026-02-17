import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Shield, Zap, Database } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Configure your company profile and AI preferences.</p>
            </div>

            <div className="grid gap-6 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Company Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Hourly Rate (€)</label>
                                <Input defaultValue="15.00" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Margin (%)</label>
                                <Input defaultValue="35" />
                            </div>
                        </div>
                        <Button>Save Settings</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Environment Mode
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Demo Mode</p>
                            <p className="text-sm text-muted-foreground">Currently running with mock data and simulated AI responses.</p>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                            ACTIVE
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
