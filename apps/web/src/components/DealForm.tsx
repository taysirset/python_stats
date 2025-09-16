import { useEffect, useMemo, useState } from "react";
import type { DealInput, UnitInput } from "../api/client";

type Props = {
	initial?: DealInput;
	onSave: (deal: DealInput) => Promise<void> | void;
	onCancel?: () => void;
};

const empty: DealInput = {
	address: "",
	listPrice: 0,
	offerPrice: 0,
	numUnits: 1,
	loanType: "30yr_fixed",
	units: [{ unitNumber: 1, rent: 0 }],
};

export function DealForm({ initial, onSave, onCancel }: Props) {
	const [deal, setDeal] = useState<DealInput>(initial ?? empty);

	useEffect(() => {
		setDeal((prev) => ({ ...empty, ...(initial ?? prev) }));
	}, [initial?.id]);

	useEffect(() => {
		setDeal((d) => {
			const target = d.numUnits;
			const current = d.units.length;
			if (target === current) return d;
			let units: UnitInput[] = d.units;
			if (target > current) {
				units = [...units];
				for (let i = current + 1; i <= target; i++) units.push({ unitNumber: i, rent: 0 });
			} else {
				units = units.slice(0, target);
			}
			return { ...d, units };
		});
	}, [deal.numUnits]);

	const monthlyRent = useMemo(() => deal.units.reduce((s, u) => s + (u.rent || 0), 0), [deal.units]);

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await onSave({ ...deal, units: deal.units.map((u, i) => ({ unitNumber: i + 1, rent: u.rent })) });
			}}
			className="deal-form"
		>
			<div>
				<label>Address</label>
				<input value={deal.address} onChange={(e) => setDeal({ ...deal, address: e.target.value })} required />
			</div>
			<div>
				<label>List Price</label>
				<input
					type="number"
					step="0.01"
					value={deal.listPrice}
					onChange={(e) => setDeal({ ...deal, listPrice: Number(e.target.value) })}
					required
				/>
			</div>
			<div>
				<label>Offer Price</label>
				<input
					type="number"
					step="0.01"
					value={deal.offerPrice}
					onChange={(e) => setDeal({ ...deal, offerPrice: Number(e.target.value) })}
					required
				/>
			</div>
			<div>
				<label>Units</label>
				<select
					value={deal.numUnits}
					onChange={(e) => setDeal({ ...deal, numUnits: Number(e.target.value) })}
				>
					{Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>
			</div>
			<div>
				<label>Loan Type</label>
				<select value={deal.loanType} onChange={(e) => setDeal({ ...deal, loanType: e.target.value as any })}>
					<option value="30yr_fixed">30 Year Fixed</option>
					<option value="15yr_fixed">15 Year Fixed</option>
					<option value="5yr_arm">5/1 ARM</option>
				</select>
			</div>
			<div>
				<strong>Unit Rents (Monthly)</strong>
				{deal.units.map((u, idx) => (
					<div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
						<span>Unit {idx + 1}</span>
						<input
							type="number"
							step="0.01"
							value={u.rent}
							onChange={(e) => {
								const rent = Number(e.target.value);
								setDeal((d) => {
									const units = d.units.slice();
									units[idx] = { ...units[idx], rent };
									return { ...d, units };
								});
							}}
						/>
					</div>
				))}
			</div>
			<div style={{ marginTop: 8 }}>Monthly Gross Rent: ${monthlyRent.toFixed(2)}</div>
			<div style={{ display: "flex", gap: 8, marginTop: 12 }}>
				<button type="submit">Save</button>
				{onCancel && (
					<button type="button" onClick={onCancel}>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}

