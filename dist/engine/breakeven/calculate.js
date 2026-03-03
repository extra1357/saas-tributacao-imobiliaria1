"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBreakeven = calculateBreakeven;
const comparador_1 = require("../comparador");
function calculateBreakeven(input = {}) {
    const monthsRented = input.monthsRented ?? 12;
    const deductions = { iptu: 0, condominio: 0, administracao: 0, seguro: 0, juroFinanciamento: 0, despesasCobranca: 0, ...input.deductions };
    const presumedProfitRate = input.presumedProfitRate ?? 0.32;
    const taxRate = input.taxRate ?? 0.1453;
    const monthsInvoiced = input.monthsInvoiced ?? 12;
    const accountingCostMonthly = input.accountingCostMonthly ?? 0;
    const precision = input.precision ?? 1;
    let lo = input.minRevenue ?? 1000;
    let hi = input.maxRevenue ?? 100000;
    const compare = (rev) => (0, comparador_1.comparePFvsPJ)({
        pf: { monthlyRent: rev, monthsRented, deductions },
        pj: { monthlyRevenue: rev, presumedProfitRate, taxRate, monthsInvoiced, accountingCostMonthly },
    });
    const atMax = compare(hi);
    if (atMax.winner !== "PJ") {
        return { breakevenMonthly: null, breakevenAnnual: null, pfTaxAtBreakeven: null, pjTaxAtBreakeven: null,
            message: `PJ não supera PF dentro do intervalo analisado (até R$ ${hi.toLocaleString("pt-BR")}/mês).` };
    }
    const atMin = compare(lo);
    if (atMin.winner === "PJ") {
        return { breakevenMonthly: lo, breakevenAnnual: lo * 12, pfTaxAtBreakeven: atMin.pf.totalTaxPaid, pjTaxAtBreakeven: atMin.pj.totalTaxPaid,
            message: `PJ já é melhor desde R$ ${lo.toLocaleString("pt-BR")}/mês no intervalo analisado.` };
    }
    while (hi - lo > precision) {
        const mid = Math.floor((lo + hi) / 2);
        compare(mid).winner === "PJ" ? (hi = mid) : (lo = mid);
    }
    const final = compare(hi);
    return {
        breakevenMonthly: hi, breakevenAnnual: hi * 12,
        pfTaxAtBreakeven: final.pf.totalTaxPaid, pjTaxAtBreakeven: final.pj.totalTaxPaid,
        message: `PJ passa a ser melhor a partir de R$ ${hi.toLocaleString("pt-BR")}/mês (R$ ${(hi * 12).toLocaleString("pt-BR")}/ano).`,
    };
}
