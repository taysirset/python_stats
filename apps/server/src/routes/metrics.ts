import { Router } from "express";
import { getAssumptions } from "../repo/assumptions.js";
import { getDeal } from "../repo/deals.js";
import { computeMetrics } from "../lib/calc.js";

export const metricsRouter = Router();

metricsRouter.get("/:dealId", (req, res) => {
	const dealId = Number(req.params.dealId);
	const deal = getDeal(dealId);
	if (!deal) return res.status(404).json({ error: "Deal not found" });
	const assumptions = getAssumptions();
	const metrics = computeMetrics(deal, assumptions);
	res.json(metrics);
});

