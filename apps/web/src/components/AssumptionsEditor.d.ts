import type { Assumptions } from "../api/client";
type Props = {
    value: Assumptions;
    onChange: (next: Partial<Assumptions>) => void;
};
export declare function AssumptionsEditor({ value, onChange }: Props): import("react").JSX.Element;
export {};
