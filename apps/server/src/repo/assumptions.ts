import { getDb } from "../lib/db.js";
import type { Assumptions } from "../models.js";

export function getAssumptions(): Assumptions {
	const db = getDb();
	const row = db.prepare("SELECT * FROM assumptions WHERE id = 1").get() as any;
	return {
		id: 1,
		downPaymentPct: row.down_payment_pct,
		interestRate30yr: row.interest_rate_30yr,
		interestRate15yr: row.interest_rate_15yr,
		interestRate5yrArm: row.interest_rate_5yr_arm,
		armAmortYears: row.arm_amort_years,
		propertyTaxRatePct: row.property_tax_rate_pct,
		maintenanceRatePct: row.maintenance_rate_pct,
		vacancyRatePct: row.vacancy_rate_pct,
	};
}

export function updateAssumptions(input: Assumptions): Assumptions {
	const db = getDb();
	const stmt = db.prepare(
		`UPDATE assumptions SET
			down_payment_pct = ?,
			interest_rate_30yr = ?,
			interest_rate_15yr = ?,
			interest_rate_5yr_arm = ?,
			arm_amort_years = ?,
			property_tax_rate_pct = ?,
			maintenance_rate_pct = ?,
			vacancy_rate_pct = ?
		WHERE id = 1`
	);
	stmt.run(
		input.downPaymentPct,
		input.interestRate30yr,
		input.interestRate15yr,
		input.interestRate5yrArm,
		input.armAmortYears,
		input.propertyTaxRatePct,
		input.maintenanceRatePct,
		input.vacancyRatePct
	);
	return getAssumptions();
}

