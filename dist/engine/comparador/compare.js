"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePFvsPJ = comparePFvsPJ;
const calculate_1 = require("../pf/calculate");
const calculate_2 = require("../pj/calculate");
function comparePFvsPJ(input) {
    const pfResult = (0, calculate_1.calculateRentalPF)(input.pf);
    // O comparador usa uma versão simplificada do input PJ (sem monthsInvoiced/accountingCostMonthly)
    const pjResult = (0, calculate_2.calculateRentalPJ)({
        monthlyRevenue: input.pj.monthlyRevenue,
        monthsInvoiced: 12,
        accountingCostMonthly: 0,
        presumedProfitRate: input.pj.presumedProfitRate,
        taxRate: input.pj.taxRate,
    });
    const winner = pfResult.totalTaxPaid < pjResult.totalTaxPaid ? "PF" : "PJ";
    const annualDifference = Math.abs(pfResult.totalTaxPaid - pjResult.totalTaxPaid);
    return {
        pf: pfResult,
        pj: pjResult,
        winner,
        annualDifference,
    };
}
