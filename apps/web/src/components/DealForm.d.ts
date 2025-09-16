import type { DealInput } from "../api/client";
type Props = {
    initial?: DealInput;
    onSave: (deal: DealInput) => Promise<void> | void;
    onCancel?: () => void;
};
export declare function DealForm({ initial, onSave, onCancel }: Props): import("react").JSX.Element;
export {};
