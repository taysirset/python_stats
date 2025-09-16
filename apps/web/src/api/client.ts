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

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
	const res = await fetch(input, {
		...init,
		headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return (await res.json()) as T;
}

export const api = {
	listDeals: () => http<DealInput[]>("/api/deals"),
	getDeal: (id: number) => http<DealInput>(`/api/deals/${id}`),
	createDeal: (deal: DealInput) => http<DealInput>("/api/deals", { method: "POST", body: JSON.stringify(deal) }),
	updateDeal: (id: number, deal: DealInput) =>
		http<DealInput>(`/api/deals/${id}`, { method: "PUT", body: JSON.stringify(deal) }),
	deleteDeal: (id: number) => http<void>(`/api/deals/${id}`, { method: "DELETE" }),

	getAssumptions: () => http<Assumptions>("/api/assumptions"),
	updateAssumptions: (a: Partial<Assumptions>) =>
		http<Assumptions>("/api/assumptions", { method: "PUT", body: JSON.stringify(a) }),

	getMetrics: (dealId: number) => http<Metrics>(`/api/metrics/${dealId}`),
};

