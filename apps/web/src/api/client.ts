export type UnitInput = { unitNumber: number; rent: number };
export type DealInput = {
	id?: number;
	address: string;
	listPrice: number;
	offerPrice: number;
	numUnits: number;
	loanType: "30yr_fixed" | "15yr_fixed" | "5yr_arm";
	units: UnitInput[];
};

export type Assumptions = {
	id: number;
	downPaymentPct: number;
	interestRate30yr: number;
	interestRate15yr: number;
	interestRate5yrArm: number;
	armAmortYears: number;
	propertyTaxRatePct: number;
	maintenanceRatePct: number;
	vacancyRatePct: number;
};

export type Metrics = {
	monthlyGrossRent: number;
	monthlyVacancy: number;
	monthlyMaintenance: number;
	monthlyPropertyTax: number;
	monthlyMortgage: number;
	monthlyCashflow: number;
	capitalInvested: number;
	yieldAnnualized: number;
};

function selectRate(loanType: DealInput["loanType"], a: Assumptions): { rate: number; years: number } {
	if (loanType === "30yr_fixed") return { rate: a.interestRate30yr, years: 30 };
	if (loanType === "15yr_fixed") return { rate: a.interestRate15yr, years: 15 };
	return { rate: a.interestRate5yrArm, years: a.armAmortYears };
}

function monthlyMortgagePayment(loanAmount: number, annualRate: number, years: number): number {
	if (loanAmount <= 0) return 0;
	const monthlyRate = annualRate / 12;
	const n = years * 12;
	if (monthlyRate === 0) return loanAmount / n;
	const numerator = monthlyRate * loanAmount;
	const denominator = 1 - Math.pow(1 + monthlyRate, -n);
	return numerator / denominator;
}

export function computeMetrics(deal: DealInput, a: Assumptions): Metrics {
	const monthlyGrossRent = deal.units.reduce((sum, u) => sum + (u.rent || 0), 0);
	const monthlyVacancy = monthlyGrossRent * a.vacancyRatePct;
	const monthlyMaintenance = monthlyGrossRent * a.maintenanceRatePct;
	const monthlyPropertyTax = (deal.offerPrice * a.propertyTaxRatePct) / 12;
	const downPayment = deal.offerPrice * a.downPaymentPct;
	const loanAmount = deal.offerPrice - downPayment;
	const { rate, years } = selectRate(deal.loanType, a);
	const monthlyMortgage = monthlyMortgagePayment(loanAmount, rate, years);
	const monthlyCashflow = monthlyGrossRent - monthlyVacancy - monthlyMaintenance - monthlyPropertyTax - monthlyMortgage;
	const capitalInvested = downPayment;
	const yieldAnnualized = capitalInvested > 0 ? (monthlyCashflow * 12) / capitalInvested : 0;
	return {
		monthlyGrossRent,
		monthlyVacancy,
		monthlyMaintenance,
		monthlyPropertyTax,
		monthlyMortgage,
		monthlyCashflow,
		capitalInvested,
		yieldAnnualized,
	};
}

import { db, ensureDefaults } from "../db";

export const api = {
	listDeals: async (): Promise<DealInput[]> => {
		await ensureDefaults();
		return db.deals.orderBy("id").reverse().toArray();
	},
	getDeal: async (id: number): Promise<DealInput> => {
		const d = await db.deals.get(id);
		if (!d) throw new Error("Not found");
		return d;
	},
	createDeal: async (deal: DealInput): Promise<DealInput> => {
		const id = await db.deals.add(deal);
		return { ...deal, id };
	},
	updateDeal: async (id: number, deal: DealInput): Promise<DealInput> => {
		await db.deals.update(id, deal);
		return { ...deal, id };
	},
	deleteDeal: async (id: number): Promise<void> => {
		await db.deals.delete(id);
	},
	getAssumptions: async (): Promise<Assumptions> => {
		await ensureDefaults();
		const a = await db.assumptions.get(1);
		if (!a) throw new Error("Assumptions missing");
		return a;
	},
	updateAssumptions: async (a: Partial<Assumptions>): Promise<Assumptions> => {
		await ensureDefaults();
		const current = (await db.assumptions.get(1))!;
		const next = { ...current, ...a } as Assumptions;
		await db.assumptions.put(next);
		return next;
	},
	getMetrics: async (dealId: number): Promise<Metrics> => {
		const [deal, assumptions] = await Promise.all([api.getDeal(dealId), api.getAssumptions()]);
		return computeMetrics(deal, assumptions);
	},
};

