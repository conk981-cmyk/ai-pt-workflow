// Mock Database Implementation for Demo Mode
// This allows the app to run without a live Postgres connection

const companies = [
    { id: "company_1", name: "Droplet Cleaning Services", settings: { defaultHourlyRate: 15.0, targetMarginPct: 35.0 } }
];

const leads = Array.from({ length: 50 }, (_, i) => ({
    id: `lead_${i + 1}`,
    contactName: `Lead Contact ${i + 1}`,
    contactEmail: `lead${i + 1}@example.com`,
    siteType: ["OFFICE", "RETAIL", "MEDICAL", "WAREHOUSE"][i % 4],
    squareMeters: 100 + (i * 10),
    frequencyPerWeek: (i % 5) + 1,
    city: "Dublin",
    county: "Dublin",
    status: ["NEW", "QUOTED", "WON", "LOST"][i % 4],
    createdAt: new Date(),
    aiLeadScore: i % 10 === 0 ? 85 : null,
    suggestedQuoteMonthly: i % 10 === 0 ? 1200 : null,
}));

const clients = Array.from({ length: 20 }, (_, i) => ({
    id: `client_${i + 1}`,
    name: `Client Company ${i + 1}`,
    city: "Dublin",
    county: "Dublin",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * i),
    contractMonthlyValue: 1500 + (i * 100),
    contractFrequencyPerWeek: (i % 5) + 1,
    churnRisk: i < 3 ? 75 : 15,
}));

const teams = [
    { id: "team_1", name: "Dublin North" },
    { id: "team_2", name: "Dublin South" },
    { id: "team_3", name: "Midlands" },
];

const jobs = Array.from({ length: 30 }, (_, i) => ({
    id: `job_${i + 1}`,
    clientId: `client_${(i % 20) + 1}`,
    client: clients[i % 20],
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i - 15)),
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * (i - 15)),
    durationMinutes: 120,
    teamId: `team_${(i % 3) + 1}`,
    team: teams[i % 3],
    priceCharged: 250,
    marginEuro: 75,
    marginPct: 30,
    status: i < 15 ? 'COMPLETED' : 'SCHEDULED',
}));

const timesheets = jobs.filter(j => j.status === 'COMPLETED').map(j => ({
    id: `ts_${j.id}`,
    jobId: j.id,
    hoursWorked: 4,
    overtimeHours: Math.random() > 0.8 ? 1 : 0,
}));

export const db = {
    company: {
        findUnique: async () => companies[0],
    },
    user: {
        count: async () => 1,
    },
    lead: {
        count: async (args: any) => leads.filter(l => args?.where?.status ? l.status === args.where.status : true).length,
        findMany: async () => leads,
        findUnique: async ({ where }: any) => leads.find(l => l.id === where.id),
        update: async ({ where, data }: any) => {
            const idx = leads.findIndex(l => l.id === where.id);
            if (idx > -1) leads[idx] = { ...leads[idx], ...data };
            return leads[idx];
        }
    },
    client: {
        findMany: async () => clients,
        findUnique: async ({ where }: any) => {
            const client = clients.find(c => c.id === where.id);
            if (client) return { ...client, jobs: jobs.filter(j => j.clientId === client.id) };
            return null;
        },
        update: async ({ where, data }: any) => {
            const idx = clients.findIndex(c => c.id === where.id);
            if (idx > -1) clients[idx] = { ...clients[idx], ...data };
            return clients[idx];
        }
    },
    job: {
        findMany: async (args: any) => {
            let res = jobs;
            if (args?.where?.status) res = res.filter(j => j.status === args.where.status);
            if (args?.where?.marginPct?.lt) res = res.filter(j => j.marginPct < args.where.marginPct.lt);
            return res;
        },
    },
    team: {
        findMany: async () => teams,
    },
    timesheet: {
        findMany: async () => timesheets,
    }
};
