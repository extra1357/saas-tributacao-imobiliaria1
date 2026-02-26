import { RentalPFInput } from "../pf/types";

export interface CompareInputPJ {
  monthlyRevenue: number;
  presumedProfitRate?: number;
  taxRate?: number;
  monthsInvoiced?: number;
  accountingCostMonthly?: number;
}

export interface CompareInput {
  pf: RentalPFInput;
  pj: CompareInputPJ;
}

export interface CompareResult {
  pf: {
    totalTaxPaid: number;
    effectiveTaxRate: number;
  };
  pj: {
    totalTaxPaid: number;
    effectiveTaxRate: number;
  };
  winner: "PF" | "PJ";
  annualDifference: number;
}
