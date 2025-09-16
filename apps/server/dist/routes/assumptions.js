import { Router } from "express";
import { AssumptionsSchema } from "../models.js";
import { getAssumptions, updateAssumptions } from "../repo/assumptions.js";
export const assumptionsRouter = Router();
assumptionsRouter.get("/", (_req, res) => {
    res.json(getAssumptions());
});
assumptionsRouter.put("/", (req, res) => {
    const parsed = AssumptionsSchema.safeParse({ id: 1, ...req.body });
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const updated = updateAssumptions(parsed.data);
    res.json(updated);
});
//# sourceMappingURL=assumptions.js.map