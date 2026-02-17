import { db as prisma } from "@/lib/db";
import { JobView } from "./job-view";

export default async function JobsPage() {
    // In a real app, you would filter by date
    const jobs = await prisma.job.findMany({
        where: {
            date: {
                gte: new Date(),
            }
        },
        include: { client: true, team: true },
        orderBy: { date: 'asc' },
    });

    const teams = await prisma.team.findMany();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Upcoming Jobs</h1>
                <p className="text-muted-foreground">Monitor and optimize your cleaning schedule.</p>
            </div>

            <JobView initialJobs={JSON.parse(JSON.stringify(jobs))} teams={JSON.parse(JSON.stringify(teams))} />
        </div>
    );
}
