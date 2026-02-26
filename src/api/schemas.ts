import { z } from "zod";

const emptyDeductions = {
  iptu: 0, condominio: 0, administracao: 0,
  seguro: 0, juroFinanciamento: 0, despesasCobranca: 0,
};

const DeductionsSchema = z.object({
  iptu:              z.number().min(0).default(0),
  condominio:        z.number().min(0).default(0),
  administracao:     z.number().min(0).default(0),
  seguro:            z.number().min(0).default(0),
  juroFinanciamento: z.number().min(0).default(0),
  despesasCobranca:  z.number().min(0).default(0),
}).default(emptyDeductions);

export const PFSchema = z.object({
  monthlyRent:  z.number().positive("monthlyRent deve ser positivo"),
  monthsRented: z.number().int().min(1).max(12).default(12),
  deductions:   DeductionsSchema,
});

export const PJSchema = z.object({
  monthlyRevenue:        z.number().positive(),
  monthsInvoiced:        z.number().int().min(1).max(12).default(12),
  accountingCostMonthly: z.number().min(0).default(0),
  presumedProfitRate:    z.number().min(0).max(1).default(0.32),
  taxRate:               z.number().min(0).max(1).default(0.1453),
});

export const CompareSchema = z.object({
  pf: PFSchema,
  pj: z.object({
    monthlyRevenue:        z.number().positive(),
    monthsInvoiced:        z.number().int().min(1).max(12).default(12),
    accountingCostMonthly: z.number().min(0).default(0),
    presumedProfitRate:    z.number().min(0).max(1).default(0.32),
    taxRate:               z.number().min(0).max(1).default(0.1453),
  }),
});

export const BreakevenSchema = z.object({
  monthsRented:          z.number().int().min(1).max(12).default(12),
  deductions:            DeductionsSchema,
  presumedProfitRate:    z.number().min(0).max(1).default(0.32),
  taxRate:               z.number().min(0).max(1).default(0.1453),
  monthsInvoiced:        z.number().int().min(1).max(12).default(12),
  accountingCostMonthly: z.number().min(0).default(0),
  minRevenue:            z.number().positive().default(1000),
  maxRevenue:            z.number().positive().default(100000),
  precision:             z.number().positive().default(1),
}).refine(d => d.minRevenue < d.maxRevenue, { message: "minRevenue deve ser menor que maxRevenue" });
