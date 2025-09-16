import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
let dbInstance = null;
export function getDb() {
    if (dbInstance)
        return dbInstance;
    const dataDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir))
        fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = path.resolve(dataDir, "app.db");
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    dbInstance = db;
    return db;
}
export async function ensureMigrations() {
    const db = getDb();
    const createAssumptions = `
	CREATE TABLE IF NOT EXISTS assumptions (
		id INTEGER PRIMARY KEY CHECK (id = 1),
		down_payment_pct REAL NOT NULL,
		interest_rate_30yr REAL NOT NULL,
		interest_rate_15yr REAL NOT NULL,
		interest_rate_5yr_arm REAL NOT NULL,
		arm_amort_years INTEGER NOT NULL,
		property_tax_rate_pct REAL NOT NULL,
		maintenance_rate_pct REAL NOT NULL,
		vacancy_rate_pct REAL NOT NULL
	);
	`;
    const createDeals = `
	CREATE TABLE IF NOT EXISTS deals (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		address TEXT NOT NULL,
		list_price REAL NOT NULL,
		offer_price REAL NOT NULL,
		num_units INTEGER NOT NULL,
		loan_type TEXT NOT NULL CHECK (loan_type in ('30yr_fixed','15yr_fixed','5yr_arm'))
	);
	`;
    const createUnits = `
	CREATE TABLE IF NOT EXISTS units (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		deal_id INTEGER NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
		unit_number INTEGER NOT NULL,
		rent REAL NOT NULL
	);
	`;
    const createUnitsIdx = `CREATE INDEX IF NOT EXISTS idx_units_deal_id ON units(deal_id);`;
    db.exec([createAssumptions, createDeals, createUnits, createUnitsIdx].join("\n"));
    const insertDefaultAssumptions = db.prepare(`
		INSERT OR IGNORE INTO assumptions (
			id, down_payment_pct, interest_rate_30yr, interest_rate_15yr, interest_rate_5yr_arm,
			arm_amort_years, property_tax_rate_pct, maintenance_rate_pct, vacancy_rate_pct
		) VALUES (1, 0.25, 0.065, 0.055, 0.0525, 30, 0.012, 0.08, 0.05)
	`);
    insertDefaultAssumptions.run();
}
//# sourceMappingURL=db.js.map