import { getDb } from "../lib/db.js";
import type { DealInput, UnitInput } from "../models.js";

export type DealRecord = {
	id: number;
	address: string;
	list_price: number;
	offer_price: number;
	num_units: number;
	loan_type: "30yr_fixed" | "15yr_fixed" | "5yr_arm";
};

export function listDeals(): Array<DealInput> {
	const db = getDb();
	const deals = db.prepare("SELECT * FROM deals ORDER BY id DESC").all() as DealRecord[];
	return deals.map((d) => ({
		id: d.id,
		address: d.address,
		listPrice: d.list_price,
		offerPrice: d.offer_price,
		numUnits: d.num_units,
		loanType: d.loan_type,
		units: listUnitsByDealId(d.id),
	}));
}

export function getDeal(id: number): DealInput | null {
	const db = getDb();
	const d = db.prepare("SELECT * FROM deals WHERE id = ?").get(id) as DealRecord | undefined;
	if (!d) return null;
	return {
		id: d.id,
		address: d.address,
		listPrice: d.list_price,
		offerPrice: d.offer_price,
		numUnits: d.num_units,
		loanType: d.loan_type,
		units: listUnitsByDealId(d.id),
	};
}

export function createDeal(input: DealInput): DealInput {
	const db = getDb();
	const insert = db.prepare(
		"INSERT INTO deals (address, list_price, offer_price, num_units, loan_type) VALUES (?, ?, ?, ?, ?)"
	);
	const result = insert.run(input.address, input.listPrice, input.offerPrice, input.numUnits, input.loanType);
	const dealId = Number(result.lastInsertRowid);
	replaceUnits(dealId, input.units);
	return getDeal(dealId)!;
}

export function updateDeal(id: number, input: DealInput): DealInput {
	const db = getDb();
	const update = db.prepare(
		"UPDATE deals SET address = ?, list_price = ?, offer_price = ?, num_units = ?, loan_type = ? WHERE id = ?"
	);
	update.run(input.address, input.listPrice, input.offerPrice, input.numUnits, input.loanType, id);
	replaceUnits(id, input.units);
	return getDeal(id)!;
}

export function deleteDeal(id: number): void {
	const db = getDb();
	db.prepare("DELETE FROM deals WHERE id = ?").run(id);
}

function listUnitsByDealId(dealId: number): UnitInput[] {
	const db = getDb();
	const rows = db
		.prepare("SELECT unit_number, rent FROM units WHERE deal_id = ? ORDER BY unit_number ASC")
		.all(dealId) as { unit_number: number; rent: number }[];
	return rows.map((r) => ({ unitNumber: r.unit_number, rent: r.rent }));
}

function replaceUnits(dealId: number, units: UnitInput[]): void {
	const db = getDb();
	const del = db.prepare("DELETE FROM units WHERE deal_id = ?");
	const ins = db.prepare("INSERT INTO units (deal_id, unit_number, rent) VALUES (?, ?, ?)");
	const tx = db.transaction(() => {
		del.run(dealId);
		for (const u of units) ins.run(dealId, u.unitNumber, u.rent);
	});
	tx();
}

