import { RentalPFInput, RentalPFResult } from "./types";
import { IRPF_BRACKETS } from "./irpfTable";

function calculateMonthlyIR(taxableMonthly: number): number {
  for (const bracket of IRPF_BRACKETS) {
    if (taxableMonthly <= bracket.upTo) {
      const tax = taxableMonthly * bracket.rate - bracket.deduction;
      return tax > 0 ? tax : 0;
    }
  }
  return 0;
}

export function calculateRentalPF(input: RentalPFInput): RentalPFResult {
  const { monthlyRent, monthsRented } = input;
  const deductions = input.deductions ?? {
    iptu: 0, condominio: 0, administracao: 0,
    seguro: 0, juroFinanciamento: 0, despesasCobranca: 0,
  };

  const grossAnnualIncome = monthlyRent * monthsRented;

  const totalMonthlyDeductions =
    deductions.iptu +
    deductions.condominio +
    deductions.administracao +
    deductions.seguro +
    deductions.juroFinanciamento +
    deductions.despesasCobranca;

  const deductibleAnnualExpenses = totalMonthlyDeductions * monthsRented;
  const taxableMonthly = Math.max(0, monthlyRent - totalMonthlyDeductions);
  const taxableAnnualBase = taxableMonthly * monthsRented;

  let totalTaxPaid = 0;
  for (let i = 0; i < monthsRented; i++) {
    totalTaxPaid += calculateMonthlyIR(taxableMonthly);
  }

  const effectiveTaxRate = grossAnnualIncome > 0 ? totalTaxPaid / grossAnnualIncome : 0;

  return {
    grossAnnualIncome,
    deductibleAnnualExpenses,
    deductionsBreakdown: {
      iptu:              deductions.iptu * monthsRented,
      condominio:        deductions.condominio * monthsRented,
      administracao:     deductions.administracao * monthsRented,
      seguro:            deductions.seguro * monthsRented,
      juroFinanciamento: deductions.juroFinanciamento * monthsRented,
      despesasCobranca:  deductions.despesasCobranca * monthsRented,
    },
    taxableAnnualBase,
    totalTaxPaid,
    effectiveTaxRate,
  };
}
