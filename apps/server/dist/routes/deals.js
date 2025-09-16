import { Router } from "express";
import { DealSchema } from "../models.js";
import { createDeal, deleteDeal, getDeal, listDeals, updateDeal } from "../repo/deals.js";
export const dealsRouter = Router();
dealsRouter.get("/", (_req, res) => {
    res.json(listDeals());
});
dealsRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const deal = getDeal(id);
    if (!deal)
        return res.status(404).json({ error: "Not found" });
    res.json(deal);
});
dealsRouter.post("/", (req, res) => {
    const parsed = DealSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const created = createDeal(parsed.data);
    res.status(201).json(created);
});
dealsRouter.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const parsed = DealSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const existing = getDeal(id);
    if (!existing)
        return res.status(404).json({ error: "Not found" });
    const updated = updateDeal(id, parsed.data);
    res.json(updated);
});
dealsRouter.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const existing = getDeal(id);
    if (!existing)
        return res.status(404).json({ error: "Not found" });
    deleteDeal(id);
    res.status(204).end();
});
//# sourceMappingURL=deals.js.map