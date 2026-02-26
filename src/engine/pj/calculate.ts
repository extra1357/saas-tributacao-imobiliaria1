export interface RentalPJInput {
  monthlyRevenue: number;
  monthsInvoiced: number;
  accountingCostMonthly: number;
  presumedProfitRate?: number; // padrão: 32% para serviços de aluguel
  taxRate?: number;            // padrão: IRPJ + CSLL + PIS + COFINS ≈ 14.53%
}

export function calculateRentalPJ(input: RentalPJInput) {
  const presumedProfitRate = input.presumedProfitRate ?? 0.32;
  const taxRate = input.taxRate ?? 0.1453;

  const grossAnnualRevenue = input.monthlyRevenue * input.monthsInvoiced;
  const accountingCostAnnual = input.accountingCostMonthly * input.monthsInvoiced;
  const presumedProfitBase = grossAnnualRevenue * presumedProfitRate;
  const totalTaxPaid = presumedProfitBase * taxRate + accountingCostAnnual;
  const effectiveTaxRate = totalTaxPaid / grossAnnualRevenue;

  return {
    grossAnnualRevenue,
    presumedProfitBase,
    totalTaxPaid,
    effectiveTaxRate,
  };
}
