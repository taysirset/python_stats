import Dexie, { Table } from "dexie";

export type UnitRecord = { unitNumber: number; rent: number };
export type DealRecord = {
	id?: number;
	address: string;
	listPrice: number;
	offerPrice: number;
	numUnits: number;
	loanType: "30yr_fixed" | "15yr_fixed" | "5yr_arm";
	units: UnitRecord[];
};

export type AssumptionsRecord = {
	id: number; // always 1
	downPaymentPct: number;
	interestRate30yr: number;
	interestRate15yr: number;
	interestRate5yrArm: number;
	armAmortYears: number;
	propertyTaxRatePct: number;
	maintenanceRatePct: number;
	vacancyRatePct: number;
};

export class AppDatabase extends Dexie {
	deals!: Table<DealRecord, number>;
	assumptions!: Table<AssumptionsRecord, number>;

	constructor() {
		super("real_estate_crm");
		this.version(1).stores({
			deals: "++id, address",
			assumptions: "id",
		});
	}
}

export const db = new AppDatabase();

export async function ensureDefaults(): Promise<void> {
	const count = await db.assumptions.count();
	if (count === 0) {
		await db.assumptions.put({
			id: 1,
			downPaymentPct: 0.25,
			interestRate30yr: 0.065,
			interestRate15yr: 0.055,
			interestRate5yrArm: 0.0525,
			armAmortYears: 30,
			propertyTaxRatePct: 0.012,
			maintenanceRatePct: 0.08,
			vacancyRatePct: 0.05,
		});
	}
}

