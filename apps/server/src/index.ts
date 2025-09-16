import express from "express";
import cors from "cors";
import { dealsRouter } from "./routes/deals.js";
import { assumptionsRouter } from "./routes/assumptions.js";
import { metricsRouter } from "./routes/metrics.js";
import { ensureMigrations } from "./lib/db.js";

await ensureMigrations();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/deals", dealsRouter);
app.use("/api/assumptions", assumptionsRouter);
app.use("/api/metrics", metricsRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
	console.log(`server listening on ${port}`);
});

