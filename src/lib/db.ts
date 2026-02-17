// Mock database layer for demo purposes
// Define enums manually to avoid @prisma/client dependency issues in this environment

export type Role = "OWNER" | "MANAGER";
export type LeadStatus = "NEW" | "QUOTED" | "WON" | "LOST";
export type SiteType = "OFFICE" | "RETAIL" | "MEDICAL" | "WAREHOUSE" | "SCHOOL" | "GYM" | "OTHER";
export type ClientStatus = "ACTIVE" | "PAUSED" | "CANCELLED";
export type JobStatus = "SCHEDULED" | "COMPLETED" | "MISSED";
export type IssueFlag = "NONE" | "COMPLAINT" | "ACCESS" | "QUALITY" | "LATE";
export type MessageType = "EMAIL" | "SMS" | "WHATSAPP";

const demoCompany = {
    id: "comp_1",
    name: "Droplet Cleaning Services",
    settings: {
        defaultHourlyRate: 15.0,
        targetMarginPct: 35.0,
    }
};

const mockLeads = Array.from({ length: 50 }, (_, i) => ({
    id: `lead_${i + 1}`,
    contactName: `Lead Contact ${i + 1}`,
    contactEmail: `lead${i + 1}@example.com`,
    city: ["Dublin", "Cork", "Galway", "Limerick"][i % 4],
    county: ["Dublin", "Cork", "Galway", "Limerick"][i % 4],
    status: (["NEW", "QUOTED", "WON", "LOST"][i % 4]) as LeadStatus,
    siteType: (["OFFICE", "RETAIL", "MEDICAL", "WAREHOUSE"][i % 4]) as SiteType,
    squareMeters: 100 + i * 10,
    frequencyPerWeek: (i % 5) + 1,
    aiLeadScore: 40 + (i % 60),
    suggestedQuoteMonthly: 500 + i * 50,
    source: i % 3 === 0 ? "referral" : "web",
    aiNotes: "Standard lead with steady growth potential.",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const mockClients = Array.from({ length: 20 }, (_, i) => ({
    id: `client_${i + 1}`,
    name: `Client Company ${i + 1}`,
    city: ["Dublin", "Cork", "Galway", "Limerick"][i % 4],
    county: ["Dublin", "Cork", "Galway", "Limerick"][i % 4],
    contractMonthlyValue: 1200 + i * 100,
    contractFrequencyPerWeek: (i % 5) + 1,
    startDate: new Date(Date.now() - i * 30 * 86400000).toISOString(),
    churnRisk: i < 3 ? 75 : 10 + (i * 2),
    churnRiskReason: i < 3 ? "Missed jobs and quality complaints." : "Stable relationship.",
    satisfactionScore: 70 + (i % 30),
}));

const mockJobs = Array.from({ length: 50 }, (_, i) => ({
    id: `job_${i + 1}`,
    clientId: `client_${(i % 20) + 1}`,
    client: mockClients[i % 20],
    date: new Date(Date.now() + (i - 10) * 86400000).toISOString(),
    startTime: new Date(Date.now() + (i - 10) * 86400000).toISOString(),
    durationMinutes: 120 + (i % 240),
    priceCharged: 400 + i * 10,
    marginPct: 15 + (i % 40),
    status: (i < 10 ? "COMPLETED" : "SCHEDULED") as JobStatus,
    issueFlag: (i === 1 ? "QUALITY" : "NONE") as IssueFlag,
}));

export const db = {
    company: {
        findFirst: async () => demoCompany,
    },
    lead: {
        findMany: async ({ where, take }: any = {}) => {
            let filtered = [...mockLeads];
            if (where?.status) filtered = filtered.filter(l => l.status === where.status);
            return take ? filtered.slice(0, take) : filtered;
        },
        findUnique: async ({ where }: any) => mockLeads.find(l => l.id === where.id),
        count: async ({ where }: any = {}) => where?.status ? mockLeads.filter(l => l.status === where.status).length : mockLeads.length,
        update: async ({ where, data }: any) => {
            const lead = mockLeads.find(l => l.id === where.id);
            return { ...lead, ...data };
        }
    },
    client: {
        findMany: async ({ where, take, orderBy }: any = {}) => {
            let filtered = [...mockClients];
            if (where?.churnRisk?.gte) filtered = filtered.filter(c => c.churnRisk >= where.churnRisk.gte);
            if (orderBy?.churnRisk === 'desc') filtered.sort((a, b) => b.churnRisk - a.churnRisk);
            return take ? filtered.slice(0, take) : filtered;
        },
        findUnique: async ({ where }: any) => {
            const client = mockClients.find(c => c.id === where.id);
            if (!client) return null;
            return {
                ...client,
                jobs: mockJobs.filter(j => j.clientId === client.id)
            };
        },
        update: async ({ where, data }: any) => {
            const client = mockClients.find(c => c.id === where.id);
            return { ...client, ...data };
        }
    },
    job: {
        findMany: async ({ where, take, orderBy }: any = {}) => {
            let filtered = [...mockJobs];
            if (where?.status) filtered = filtered.filter(j => j.status === where.status);
            if (where?.marginPct?.lt) filtered = filtered.filter(j => j.marginPct < where.marginPct.lt);
            if (orderBy?.marginPct === 'asc') filtered.sort((a, b) => a.marginPct - b.marginPct);
            return take ? filtered.slice(0, take) : filtered;
        }
    },
    team: {
        findMany: async () => [{ id: "team1", name: "Dublin North" }, { id: "team2", name: "Dublin South" }],
    },
    timesheet: {
        findMany: async () => [{ id: "ts1", hoursWorked: 40, overtimeHours: 5 }],
    }
};
