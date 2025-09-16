import { useEffect, useState } from "react";
import type { Assumptions } from "../api/client";

type Props = {
	value: Assumptions;
	onChange: (next: Partial<Assumptions>) => void;
};

export function AssumptionsEditor({ value, onChange }: Props) {
	const [local, setLocal] = useState<Assumptions>(value);

	useEffect(() => setLocal(value), [value.id]);

	function numberInput(key: keyof Assumptions, factor = 1) {
		return (
			<input
				type="number"
				step="0.0001"
				value={(local[key] as number) * factor}
				onChange={(e) => {
					const raw = Number(e.target.value) / factor;
					const next = { ...local, [key]: raw } as Assumptions;
					setLocal(next);
					onChange({ [key]: raw } as Partial<Assumptions>);
				}}
			/>
		);
	}

	return (
		<div className="assumptions-editor" style={{ display: "grid", gap: 8 }}>
			<label>
				Down Payment %
				{numberInput("downPaymentPct", 100)}
			</label>
			<label>
				Interest 30yr %
				{numberInput("interestRate30yr", 100)}
			</label>
			<label>
				Interest 15yr %
				{numberInput("interestRate15yr", 100)}
			</label>
			<label>
				Interest 5yr ARM %
				{numberInput("interestRate5yrArm", 100)}
			</label>
			<label>
				ARM Amort Years
				<input
					type="number"
					value={local.armAmortYears}
					onChange={(e) => {
						const val = Number(e.target.value);
						setLocal({ ...local, armAmortYears: val });
						onChange({ armAmortYears: val });
					}}
				/>
			</label>
			<label>
				Property Tax %
				{numberInput("propertyTaxRatePct", 100)}
			</label>
			<label>
				Maintenance %
				{numberInput("maintenanceRatePct", 100)}
			</label>
			<label>
				Vacancy %
				{numberInput("vacancyRatePct", 100)}
			</label>
		</div>
	);
}

