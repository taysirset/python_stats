export type UnitInput = {
    unitNumber: number;
    rent: number;
};
export type DealInput = {
    id?: number;
    address: string;
    listPrice: number;
    offerPrice: number;
    numUnits: number;
    loanType: "30yr_fixed" | "15yr_fixed" | "5yr_arm";
    units: UnitInput[];
};
export type Assumptions = {
    id: number;
    downPaymentPct: number;
    interestRate30yr: number;
    interestRate15yr: number;
    interestRate5yrArm: number;
    armAmortYears: number;
    propertyTaxRatePct: number;
    maintenanceRatePct: number;
    vacancyRatePct: number;
};
export type Metrics = {
    monthlyGrossRent: number;
    monthlyVacancy: number;
    monthlyMaintenance: number;
    monthlyPropertyTax: number;
    monthlyMortgage: number;
    monthlyCashflow: number;
    capitalInvested: number;
    yieldAnnualized: number;
};
export declare const api: {
    listDeals: () => Promise<DealInput[]>;
    getDeal: (id: number) => Promise<DealInput>;
    createDeal: (deal: DealInput) => Promise<DealInput>;
    updateDeal: (id: number, deal: DealInput) => Promise<DealInput>;
    deleteDeal: (id: number) => Promise<void>;
    getAssumptions: () => Promise<Assumptions>;
    updateAssumptions: (a: Partial<Assumptions>) => Promise<Assumptions>;
    getMetrics: (dealId: number) => Promise<Metrics>;
};
