import { z } from "zod";
export declare const UnitSchema: z.ZodObject<{
    unitNumber: z.ZodNumber;
    rent: z.ZodNumber;
}, z.core.$strip>;
export type UnitInput = z.infer<typeof UnitSchema>;
export declare const DealSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    address: z.ZodString;
    listPrice: z.ZodNumber;
    offerPrice: z.ZodNumber;
    numUnits: z.ZodNumber;
    loanType: z.ZodDefault<z.ZodEnum<{
        "30yr_fixed": "30yr_fixed";
        "15yr_fixed": "15yr_fixed";
        "5yr_arm": "5yr_arm";
    }>>;
    units: z.ZodArray<z.ZodObject<{
        unitNumber: z.ZodNumber;
        rent: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DealInput = z.infer<typeof DealSchema>;
export declare const AssumptionsSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodNumber>;
    downPaymentPct: z.ZodDefault<z.ZodNumber>;
    interestRate30yr: z.ZodDefault<z.ZodNumber>;
    interestRate15yr: z.ZodDefault<z.ZodNumber>;
    interestRate5yrArm: z.ZodDefault<z.ZodNumber>;
    armAmortYears: z.ZodDefault<z.ZodNumber>;
    propertyTaxRatePct: z.ZodDefault<z.ZodNumber>;
    maintenanceRatePct: z.ZodDefault<z.ZodNumber>;
    vacancyRatePct: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type Assumptions = z.infer<typeof AssumptionsSchema>;
export declare const MetricsSchema: z.ZodObject<{
    monthlyGrossRent: z.ZodNumber;
    monthlyVacancy: z.ZodNumber;
    monthlyMaintenance: z.ZodNumber;
    monthlyPropertyTax: z.ZodNumber;
    monthlyMortgage: z.ZodNumber;
    monthlyCashflow: z.ZodNumber;
    capitalInvested: z.ZodNumber;
    yieldAnnualized: z.ZodNumber;
}, z.core.$strip>;
export type Metrics = z.infer<typeof MetricsSchema>;
//# sourceMappingURL=models.d.ts.map