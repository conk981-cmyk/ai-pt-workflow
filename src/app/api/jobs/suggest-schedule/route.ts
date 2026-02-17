import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { date } = await req.json(); // Single day optimization for demo

        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const jobs = await prisma.job.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: 'SCHEDULED',
            },
            include: {
                client: true,
            }
        });

        const teams = await prisma.team.findMany();

        if (jobs.length === 0) {
            return NextResponse.json({ message: "No jobs to schedule for this date." });
        }

        // Heuristic: Group by county
        const jobsByCounty: Record<string, any[]> = {};
        jobs.forEach(job => {
            const county = job.client.county;
            if (!jobsByCounty[county]) jobsByCounty[county] = [];
            jobsByCounty[county].push(job);
        });

        // Assign counties to teams
        const proposal: any[] = [];
        const countyList = Object.keys(jobsByCounty);

        countyList.forEach((county, index) => {
            const team = teams[index % teams.length];
            jobsByCounty[county].forEach(job => {
                proposal.push({
                    jobId: job.id,
                    jobName: `${job.client.name} - ${job.client.city}`,
                    county: county,
                    originalTeamId: job.teamId,
                    suggestedTeamId: team.id,
                    suggestedTeamName: team.name,
                });
            });
        });

        return NextResponse.json({ proposal });
    } catch (error) {
        console.error("Schedule Suggest Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
