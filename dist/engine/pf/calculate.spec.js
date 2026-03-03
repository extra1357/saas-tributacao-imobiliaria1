"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculate_1 = require("./calculate");
const noDeductions = { iptu: 0, condominio: 0, administracao: 0, seguro: 0, juroFinanciamento: 0, despesasCobranca: 0 };
describe("Engine PF – IRPF sobre aluguel", () => {
    it("isento: aluguel abaixo da faixa tributável", () => {
        const result = (0, calculate_1.calculateRentalPF)({ monthlyRent: 2000, monthsRented: 12, deductions: noDeductions });
        expect(result.totalTaxPaid).toBe(0);
        expect(result.effectiveTaxRate).toBe(0);
    });
    it("aluguel na faixa de 7,5%", () => {
        const result = (0, calculate_1.calculateRentalPF)({ monthlyRent: 3000, monthsRented: 12, deductions: noDeductions });
        expect(result.totalTaxPaid).toBeGreaterThan(0);
        expect(result.effectiveTaxRate).toBeLessThan(0.075);
    });
    it("aluguel alto: faixa de 27,5%", () => {
        const result = (0, calculate_1.calculateRentalPF)({ monthlyRent: 10000, monthsRented: 12, deductions: noDeductions });
        expect(result.effectiveTaxRate).toBeGreaterThan(0.15);
    });
    it("deduções reduzem base tributável", () => {
        const semDed = (0, calculate_1.calculateRentalPF)({ monthlyRent: 5000, monthsRented: 12, deductions: noDeductions });
        const comDed = (0, calculate_1.calculateRentalPF)({ monthlyRent: 5000, monthsRented: 12, deductions: { ...noDeductions, iptu: 500, condominio: 300 } });
        expect(comDed.totalTaxPaid).toBeLessThan(semDed.totalTaxPaid);
        expect(comDed.taxableAnnualBase).toBeLessThan(semDed.taxableAnnualBase);
    });
    it("receita bruta anual = aluguel * meses", () => {
        const result = (0, calculate_1.calculateRentalPF)({ monthlyRent: 4000, monthsRented: 6, deductions: noDeductions });
        expect(result.grossAnnualIncome).toBe(24000);
    });
    it("aluguel parcial: menos de 12 meses", () => {
        const result = (0, calculate_1.calculateRentalPF)({ monthlyRent: 5000, monthsRented: 6, deductions: noDeductions });
        expect(result.grossAnnualIncome).toBe(30000);
    });
    it("deduções não podem tornar base negativa", () => {
        const result = (0, calculate_1.calculateRentalPF)({ monthlyRent: 1000, monthsRented: 12, deductions: { ...noDeductions, iptu: 2000 } });
        expect(result.taxableAnnualBase).toBe(0);
        expect(result.totalTaxPaid).toBe(0);
    });
});
