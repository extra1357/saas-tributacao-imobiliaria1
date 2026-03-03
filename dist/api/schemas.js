"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakevenSchema = exports.CompareSchema = exports.PJSchema = exports.PFSchema = void 0;
const zod_1 = require("zod");
const emptyDeductions = {
    iptu: 0, condominio: 0, administracao: 0,
    seguro: 0, juroFinanciamento: 0, despesasCobranca: 0,
};
const DeductionsSchema = zod_1.z.object({
    iptu: zod_1.z.number().min(0).default(0),
    condominio: zod_1.z.number().min(0).default(0),
    administracao: zod_1.z.number().min(0).default(0),
    seguro: zod_1.z.number().min(0).default(0),
    juroFinanciamento: zod_1.z.number().min(0).default(0),
    despesasCobranca: zod_1.z.number().min(0).default(0),
}).default(emptyDeductions);
exports.PFSchema = zod_1.z.object({
    monthlyRent: zod_1.z.number().positive("monthlyRent deve ser positivo"),
    monthsRented: zod_1.z.number().int().min(1).max(12).default(12),
    deductions: DeductionsSchema,
});
exports.PJSchema = zod_1.z.object({
    monthlyRevenue: zod_1.z.number().positive(),
    monthsInvoiced: zod_1.z.number().int().min(1).max(12).default(12),
    accountingCostMonthly: zod_1.z.number().min(0).default(0),
    presumedProfitRate: zod_1.z.number().min(0).max(1).default(0.32),
    taxRate: zod_1.z.number().min(0).max(1).default(0.1453),
});
exports.CompareSchema = zod_1.z.object({
    pf: exports.PFSchema,
    pj: zod_1.z.object({
        monthlyRevenue: zod_1.z.number().positive(),
        monthsInvoiced: zod_1.z.number().int().min(1).max(12).default(12),
        accountingCostMonthly: zod_1.z.number().min(0).default(0),
        presumedProfitRate: zod_1.z.number().min(0).max(1).default(0.32),
        taxRate: zod_1.z.number().min(0).max(1).default(0.1453),
    }),
});
exports.BreakevenSchema = zod_1.z.object({
    monthsRented: zod_1.z.number().int().min(1).max(12).default(12),
    deductions: DeductionsSchema,
    presumedProfitRate: zod_1.z.number().min(0).max(1).default(0.32),
    taxRate: zod_1.z.number().min(0).max(1).default(0.1453),
    monthsInvoiced: zod_1.z.number().int().min(1).max(12).default(12),
    accountingCostMonthly: zod_1.z.number().min(0).default(0),
    minRevenue: zod_1.z.number().positive().default(1000),
    maxRevenue: zod_1.z.number().positive().default(100000),
    precision: zod_1.z.number().positive().default(1),
}).refine(d => d.minRevenue < d.maxRevenue, { message: "minRevenue deve ser menor que maxRevenue" });
