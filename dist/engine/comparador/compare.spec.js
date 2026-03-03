"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compare_1 = require("./compare");
const noDeductions = { iptu: 0, condominio: 0, administracao: 0, seguro: 0, juroFinanciamento: 0, despesasCobranca: 0 };
describe("Engine Comparator – PF vs PJ", () => {
    it("PF paga menos imposto em aluguel baixo", () => {
        const result = (0, compare_1.comparePFvsPJ)({
            pf: { monthlyRent: 2000, monthsRented: 12, deductions: noDeductions },
            pj: { monthlyRevenue: 2000 },
        });
        expect(result.winner).toBe("PF");
    });
    it("PJ paga menos imposto em aluguel alto", () => {
        const result = (0, compare_1.comparePFvsPJ)({
            pf: { monthlyRent: 15000, monthsRented: 12, deductions: noDeductions },
            pj: { monthlyRevenue: 15000 },
        });
        expect(result.winner).toBe("PJ");
    });
    it("annualDifference é positivo e igual à diferença entre os impostos", () => {
        const result = (0, compare_1.comparePFvsPJ)({
            pf: { monthlyRent: 10000, monthsRented: 12, deductions: noDeductions },
            pj: { monthlyRevenue: 10000 },
        });
        const diff = Math.abs(result.pf.totalTaxPaid - result.pj.totalTaxPaid);
        expect(result.annualDifference).toBeCloseTo(diff, 2);
    });
});
