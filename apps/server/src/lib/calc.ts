import type { Assumptions, DealInput, Metrics } from "../models.js";

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

