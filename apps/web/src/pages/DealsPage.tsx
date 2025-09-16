import { useEffect, useMemo, useState } from "react";
import { api, type Assumptions, type DealInput, type Metrics } from "../api/client";
import { DealForm } from "../components/DealForm";
import { AssumptionsEditor } from "../components/AssumptionsEditor";

export default function DealsPage() {
	const [deals, setDeals] = useState<DealInput[]>([]);
	const [selected, setSelected] = useState<DealInput | null>(null);
	const [assumptions, setAssumptions] = useState<Assumptions | null>(null);
	const [metrics, setMetrics] = useState<Record<number, Metrics>>({});
	const [assumptionsOpen, setAssumptionsOpen] = useState(false);

	async function refreshDeals() {
		const d = await api.listDeals();
		setDeals(d);
		const m: Record<number, Metrics> = {};
		for (const deal of d) m[deal.id!] = await api.getMetrics(deal.id!);
		setMetrics(m);
	}

	useEffect(() => {
		api.getAssumptions().then(setAssumptions);
		refreshDeals();
	}, []);

	const totalMonthlyCashflow = useMemo(
		() => Object.values(metrics).reduce((s, m) => s + (m?.monthlyCashflow || 0), 0),
		[metrics]
	);

	return (
		<div style={{ padding: 16, display: "grid", gap: 12 }}>
			<h2>Real Estate Deals</h2>
			<div style={{ display: "flex", gap: 8 }}>
				<button onClick={() => setSelected({ address: "", listPrice: 0, offerPrice: 0, numUnits: 1, loanType: "30yr_fixed", units: [{ unitNumber: 1, rent: 0 }] })}>New Deal</button>
				<button onClick={() => setAssumptionsOpen(true)}>Edit Assumptions</button>
			</div>
			{assumptionsOpen && assumptions && (
				<div style={{ border: "1px solid #ccc", padding: 12 }}>
					<h3>Assumptions</h3>
					<AssumptionsEditor
						value={assumptions}
						onChange={async (next) => {
							const updated = await api.updateAssumptions(next);
							setAssumptions(updated);
							await refreshDeals();
						}}
					/>
					<div style={{ marginTop: 8 }}>
						<button onClick={() => setAssumptionsOpen(false)}>Close</button>
					</div>
				</div>
			)}
			{selected && (
				<div style={{ border: "1px solid #ccc", padding: 12 }}>
					<h3>{selected.id ? "Edit Deal" : "New Deal"}</h3>
					<DealForm
						initial={selected}
						onCancel={() => setSelected(null)}
						onSave={async (deal) => {
							if (deal.id) await api.updateDeal(deal.id, deal);
							else await api.createDeal(deal);
							setSelected(null);
							await refreshDeals();
						}}
					/>
				</div>
			)}
			<div>
				<h3>Deals</h3>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							<th>Address</th>
							<th>Offer</th>
							<th>Units</th>
							<th>Gross Rent</th>
							<th>Cashflow (mo)</th>
							<th>Yield (ann)</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{deals.map((d) => (
							<tr key={d.id} style={{ borderTop: "1px solid #eee" }}>
								<td>{d.address}</td>
								<td>${d.offerPrice.toLocaleString()}</td>
								<td>{d.numUnits}</td>
								<td>${(d.units || []).reduce((s, u) => s + (u.rent || 0), 0).toFixed(2)}</td>
								<td>${(metrics[d.id!]?.monthlyCashflow ?? 0).toFixed(2)}</td>
								<td>{(((metrics[d.id!]?.yieldAnnualized ?? 0) * 100).toFixed(2))}%</td>
								<td style={{ display: "flex", gap: 4 }}>
									<button onClick={() => setSelected(d)}>Edit</button>
									<button
										onClick={async () => {
											await api.deleteDeal(d.id!);
											await refreshDeals();
										}}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<h3>Portfolio</h3>
				<div>Total Monthly Cashflow: ${totalMonthlyCashflow.toFixed(2)}</div>
			</div>
		</div>
	);
}

