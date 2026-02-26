// src/engine/pf/types.ts
// Despesas dedutíveis conforme Lei 7.713/1988 e RIR (Decreto 9.580/2018)

export interface RentalPFDeductions {
  iptu: number;                // IPTU pago pelo proprietário
  condominio: number;          // Condomínio pago pelo proprietário
  administracao: number;       // Taxa de administração imobiliária (% ou valor fixo)
  seguro: number;              // Seguro do imóvel pago pelo proprietário
  juroFinanciamento: number;   // Juros de financiamento do imóvel alugado
  despesasCobranca: number;    // Honorários advocatícios, cobrança judicial
}

export interface RentalPFInput {
  monthlyRent: number;
  monthsRented: number;
  deductions: RentalPFDeductions;
}

export interface RentalPFResult {
  grossAnnualIncome: number;
  deductibleAnnualExpenses: number;
  deductionsBreakdown: {
    iptu: number;
    condominio: number;
    administracao: number;
    seguro: number;
    juroFinanciamento: number;
    despesasCobranca: number;
  };
  taxableAnnualBase: number;
  totalTaxPaid: number;
  effectiveTaxRate: number;
}
