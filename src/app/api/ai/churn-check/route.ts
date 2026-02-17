import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { clientId } = await req.json();

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                jobs: {
                    take: 10,
                    orderBy: { date: 'desc' },
                }
            }
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        // AI Logic Simulation / Deterministic Fallback
        let risk = 10;
        let reason = "Client relationship is stable.";

        const missedJobs = client.jobs.filter(j => j.status === 'MISSED').length;
        const complaints = client.jobs.filter(j => j.issueFlag === 'COMPLAINT').length;
        const qualityIssues = client.jobs.filter(j => j.issueFlag === 'QUALITY').length;

        risk += missedJobs * 25;
        risk += complaints * 30;
        risk += qualityIssues * 15;

        if (client.satisfactionScore && client.satisfactionScore < 70) {
            risk += (70 - client.satisfactionScore);
        }

        risk = Math.min(risk, 100);

        if (risk >= 70) {
            reason = `High Risk: ${missedJobs} missed jobs and ${complaints} complaints in last 10 visits. Immediate outreach required.`;
        } else if (risk >= 40) {
            reason = `Medium Risk: Some quality issues reported. Monitor satisfaction closely.`;
        }

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: {
                churnRisk: risk,
                churnRiskReason: reason,
            },
        });

        return NextResponse.json(updatedClient);
    } catch (error) {
        console.error("Churn AI Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
