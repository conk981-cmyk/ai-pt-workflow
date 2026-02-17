import { db as prisma } from "@/lib/db";
import { LeadTable } from "./lead-table";

export default async function LeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Leads & Opportunities</h1>
                <p className="text-muted-foreground">Track new inquiries and use AI to prioritize high-value leads.</p>
            </div>

            <LeadTable initialLeads={JSON.parse(JSON.stringify(leads))} />
        </div>
    );
}
