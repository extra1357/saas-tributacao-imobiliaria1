// src/engine/pj/types.ts
export interface RentalPJInput {
  monthlyRevenue: number;
  monthsInvoiced: number;
  accountingCostMonthly: number;
  presumedProfitRate?: number; // padrão: 32% (serviços/aluguel)
  taxRate?: number;            // padrão: IRPJ + CSLL + PIS + COFINS ≈ 14.53%
}
