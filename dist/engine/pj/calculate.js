"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRentalPJ = calculateRentalPJ;
function calculateRentalPJ(input) {
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
