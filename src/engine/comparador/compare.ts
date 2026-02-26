import { calculateRentalPF } from "../pf/calculate";
import { calculateRentalPJ } from "../pj/calculate";
import { CompareInput, CompareResult } from "./types";

export function comparePFvsPJ(input: CompareInput): CompareResult {
  const pfResult = calculateRentalPF(input.pf);

  // O comparador usa uma versão simplificada do input PJ (sem monthsInvoiced/accountingCostMonthly)
  const pjResult = calculateRentalPJ({
    monthlyRevenue: input.pj.monthlyRevenue,
    monthsInvoiced: 12,
    accountingCostMonthly: 0,
    presumedProfitRate: input.pj.presumedProfitRate,
    taxRate: input.pj.taxRate,
  });

  const winner =
    pfResult.totalTaxPaid < pjResult.totalTaxPaid ? "PF" : "PJ";

  const annualDifference =
    Math.abs(pfResult.totalTaxPaid - pjResult.totalTaxPaid);

  return {
    pf: pfResult,
    pj: pjResult,
    winner,
    annualDifference,
  };
}
