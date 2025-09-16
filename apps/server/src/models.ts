import { z } from "zod";

export const UnitSchema = z.object({
	unitNumber: z.number().int().nonnegative(),
	rent: z.number().nonnegative(),
});

export type UnitInput = z.infer<typeof UnitSchema>;

export const DealSchema = z.object({
	id: z.number().int().positive().optional(),
	address: z.string().min(1),
	listPrice: z.number().nonnegative(),
	offerPrice: z.number().nonnegative(),
	numUnits: z.number().int().positive(),
	loanType: z.enum(["30yr_fixed", "15yr_fixed", "5yr_arm"]).default("30yr_fixed"),
	units: z.array(UnitSchema),
});

export type DealInput = z.infer<typeof DealSchema>;

export const AssumptionsSchema = z.object({
	id: z.number().int().positive().default(1),
	downPaymentPct: z.number().min(0).max(1).default(0.25),
	interestRate30yr: z.number().min(0).max(1).default(0.065),
	interestRate15yr: z.number().min(0).max(1).default(0.055),
	interestRate5yrArm: z.number().min(0).max(1).default(0.0525),
	armAmortYears: z.number().int().positive().default(30),
	propertyTaxRatePct: z.number().min(0).max(1).default(0.012),
	maintenanceRatePct: z.number().min(0).max(1).default(0.08),
	vacancyRatePct: z.number().min(0).max(1).default(0.05),
});

export type Assumptions = z.infer<typeof AssumptionsSchema>;

export const MetricsSchema = z.object({
	monthlyGrossRent: z.number(),
	monthlyVacancy: z.number(),
	monthlyMaintenance: z.number(),
	monthlyPropertyTax: z.number(),
	monthlyMortgage: z.number(),
	monthlyCashflow: z.number(),
	capitalInvested: z.number(),
	yieldAnnualized: z.number(),
});

export type Metrics = z.infer<typeof MetricsSchema>;

