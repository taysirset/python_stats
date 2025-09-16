import type { DealInput } from "../models.js";
export type DealRecord = {
    id: number;
    address: string;
    list_price: number;
    offer_price: number;
    num_units: number;
    loan_type: "30yr_fixed" | "15yr_fixed" | "5yr_arm";
};
export declare function listDeals(): Array<DealInput>;
export declare function getDeal(id: number): DealInput | null;
export declare function createDeal(input: DealInput): DealInput;
export declare function updateDeal(id: number, input: DealInput): DealInput;
export declare function deleteDeal(id: number): void;
//# sourceMappingURL=deals.d.ts.map