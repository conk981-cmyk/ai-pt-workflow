import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { leadId } = await req.json();

        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
        });

        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        // AI Logic Simulation / Deterministic Fallback
        // In a real app, you would call OpenAI here
        let score = 50;
        let suggestedQuote = 500;
        let notes = "Based on lead criteria, this is a standard opportunity.";

        // Simple heuristic-based score
        if (lead.squareMeters > 500) score += 20;
        if (lead.frequencyPerWeek >= 3) score += 15;
        if (lead.source === 'referral') score += 10;
        if (lead.county === 'Dublin') score += 5;

        // Quote suggestion logic
        const baseRate = 15; // hourly
        const hoursPerVisit = lead.squareMeters / 100; // 1hr per 100sqm
        const monthlyVisits = lead.frequencyPerWeek * 4.33;
        suggestedQuote = Math.round(baseRate * hoursPerVisit * monthlyVisits * 1.3); // 30% margin

        notes = `AI Analysis: Lead has a score of ${score}/100. High potential due to ${lead.squareMeters}sqm site and ${lead.frequencyPerWeek}x weekly frequency. Suggested monthly quote of €${suggestedQuote} ensures a healthy margin for the ${lead.siteType} site type in ${lead.county}.`;

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: {
                aiLeadScore: score,
                suggestedQuoteMonthly: suggestedQuote,
                aiNotes: notes,
            },
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error("Lead AI Score Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
