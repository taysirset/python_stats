import { getDb } from "../lib/db.js";
export function listDeals() {
    const db = getDb();
    const deals = db.prepare("SELECT * FROM deals ORDER BY id DESC").all();
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
export function getDeal(id) {
    const db = getDb();
    const d = db.prepare("SELECT * FROM deals WHERE id = ?").get(id);
    if (!d)
        return null;
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
export function createDeal(input) {
    const db = getDb();
    const insert = db.prepare("INSERT INTO deals (address, list_price, offer_price, num_units, loan_type) VALUES (?, ?, ?, ?, ?)");
    const result = insert.run(input.address, input.listPrice, input.offerPrice, input.numUnits, input.loanType);
    const dealId = Number(result.lastInsertRowid);
    replaceUnits(dealId, input.units);
    return getDeal(dealId);
}
export function updateDeal(id, input) {
    const db = getDb();
    const update = db.prepare("UPDATE deals SET address = ?, list_price = ?, offer_price = ?, num_units = ?, loan_type = ? WHERE id = ?");
    update.run(input.address, input.listPrice, input.offerPrice, input.numUnits, input.loanType, id);
    replaceUnits(id, input.units);
    return getDeal(id);
}
export function deleteDeal(id) {
    const db = getDb();
    db.prepare("DELETE FROM deals WHERE id = ?").run(id);
}
function listUnitsByDealId(dealId) {
    const db = getDb();
    const rows = db
        .prepare("SELECT unit_number, rent FROM units WHERE deal_id = ? ORDER BY unit_number ASC")
        .all(dealId);
    return rows.map((r) => ({ unitNumber: r.unit_number, rent: r.rent }));
}
function replaceUnits(dealId, units) {
    const db = getDb();
    const del = db.prepare("DELETE FROM units WHERE deal_id = ?");
    const ins = db.prepare("INSERT INTO units (deal_id, unit_number, rent) VALUES (?, ?, ?)");
    const tx = db.transaction(() => {
        del.run(dealId);
        for (const u of units)
            ins.run(dealId, u.unitNumber, u.rent);
    });
    tx();
}
//# sourceMappingURL=deals.js.map