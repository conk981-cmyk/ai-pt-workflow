import { db as prisma } from "@/lib/db";
import { ClientTable } from "./client-table";

export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Client Portfolio</h1>
                <p className="text-muted-foreground">Manage relationships and monitor churn risk.</p>
            </div>

            <ClientTable initialClients={JSON.parse(JSON.stringify(clients))} />
        </div>
    );
}
