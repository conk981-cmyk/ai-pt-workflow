import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.messageLog.deleteMany({});
  await prisma.timesheet.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});

  // 1. Create Company
  const company = await prisma.company.create({
    data: {
      name: 'Droplet Cleaning Services',
      settings: {
        defaultHourlyRate: 15.0,
        targetMarginPct: 35.0,
        countyMultipliers: {
          'Dublin': 1.2,
          'Louth': 1.0,
          'Meath': 1.0,
          'Kildare': 1.1,
          'Wicklow': 1.1,
        }
      }
    }
  });

  // 2. Create User
  await prisma.user.create({
    data: {
      email: 'admin@droplet.com',
      password: 'password123', // In a real app, this would be hashed
      name: 'Admin User',
      role: 'OWNER',
      companyId: company.id,
    }
  });

  // 3. Create Teams & Staff
  const teamNames = ['Dublin North', 'Dublin South', 'Midlands'];
  const teams = [];
  for (const name of teamNames) {
    const team = await prisma.team.create({
      data: {
        name,
        companyId: company.id,
      }
    });
    teams.push(team);

    // 5 staff per team
    for (let i = 1; i <= 5; i++) {
      await prisma.staff.create({
        data: {
          name: `${name} Cleaner ${i}`,
          teamId: team.id,
          hourlyRate: 14 + Math.random() * 4,
          skills: ['general', 'window', 'carpet'],
          active: true,
        }
      });
    }
  }

  const allStaff = await prisma.staff.findMany();

  // 4. Create Leads (50)
  const counties = ['Dublin', 'Louth', 'Meath', 'Kildare', 'Wicklow'];
  const siteTypes = ['OFFICE', 'RETAIL', 'MEDICAL', 'WAREHOUSE', 'SCHOOL', 'GYM'];
  const leadStatuses = ['NEW', 'QUOTED', 'WON', 'LOST'];

  for (let i = 1; i <= 50; i++) {
    const status = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
    const county = counties[Math.floor(Math.random() * counties.length)];

    await prisma.lead.create({
      data: {
        companyId: company.id,
        source: ['web', 'phone', 'email', 'referral'][Math.floor(Math.random() * 4)],
        contactName: `Lead Contact ${i}`,
        contactEmail: `lead${i}@example.com`,
        contactPhone: `087-12345${i.toString().padStart(2, '0')}`,
        siteType: siteTypes[Math.floor(Math.random() * siteTypes.length)],
        address: `${10 + i} Main St`,
        city: 'Town',
        county: county,
        squareMeters: 50 + Math.random() * 500,
        frequencyPerWeek: Math.floor(Math.random() * 5) + 1,
        requiredStartDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: status,
        aiLeadScore: Math.floor(Math.random() * 100),
        aiNotes: 'Lead shows high interest in eco-friendly products.',
        suggestedQuoteMonthly: 500 + Math.random() * 2000,
      }
    });
  }

  // 5. Create Clients (20)
  const clients = [];
  for (let i = 1; i <= 20; i++) {
    const client = await prisma.client.create({
      data: {
        companyId: company.id,
        name: `Client Company ${i}`,
        address: `${50 + i} Business Park`,
        city: 'City',
        county: counties[Math.floor(Math.random() * counties.length)],
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
        contractMonthlyValue: 1000 + Math.random() * 3000,
        contractFrequencyPerWeek: Math.floor(Math.random() * 5) + 1,
        satisfactionScore: 60 + Math.floor(Math.random() * 40),
        churnRisk: i <= 3 ? 75 : Math.floor(Math.random() * 50),
        churnRiskReason: i <= 3 ? 'Recent missed jobs and complaints.' : null,
      }
    });
    clients.push(client);
  }

  // 6. Create Jobs (200 over last 90 days)
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 200; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const jobDate = new Date(ninetyDaysAgo.getTime() + Math.random() * (now.getTime() - ninetyDaysAgo.getTime()));

    const priceCharged = client.contractMonthlyValue / (client.contractFrequencyPerWeek * 4.33);
    const estimatedCost = priceCharged * (0.5 + Math.random() * 0.4); // 50-90% cost
    const marginEuro = priceCharged - estimatedCost;
    const marginPct = (marginEuro / priceCharged) * 100;

    const job = await prisma.job.create({
      data: {
        clientId: client.id,
        date: jobDate,
        startTime: jobDate,
        durationMinutes: 120 + Math.floor(Math.random() * 240),
        teamId: team.id,
        estimatedCost,
        priceCharged,
        marginEuro,
        marginPct,
        status: jobDate < now ? 'COMPLETED' : 'SCHEDULED',
        issueFlag: Math.random() > 0.9 ? 'QUALITY' : 'NONE',
      }
    });

    // If completed, create timesheets
    if (job.status === 'COMPLETED') {
      const teamStaff = allStaff.filter(s => s.teamId === team.id);
      const assignedStaff = teamStaff.slice(0, 2);
      for (const staff of assignedStaff) {
        await prisma.timesheet.create({
          data: {
            staffId: staff.id,
            jobId: job.id,
            hoursWorked: job.durationMinutes / 60,
            overtimeHours: Math.random() > 0.8 ? 1 : 0,
            notes: 'Completed successfully.',
          }
        });
      }
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
