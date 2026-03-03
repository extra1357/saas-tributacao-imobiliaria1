"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculate_1 = require("./calculate");
describe('Engine PJ – Lucro Presumido', () => {
    test('Calcula corretamente PJ com faturamento moderado', () => {
        const result = (0, calculate_1.calculateRentalPJ)({
            monthlyRevenue: 5000,
            monthsInvoiced: 12,
            accountingCostMonthly: 300,
        });
        expect(result.grossAnnualRevenue).toBe(60000);
        expect(result.presumedProfitBase).toBe(19200);
        expect(result.totalTaxPaid).toBeGreaterThan(0);
        expect(result.effectiveTaxRate).toBeGreaterThan(0);
        expect(result.effectiveTaxRate).toBeLessThan(0.25);
    });
    test('Carga tributária PJ é menor que PF em renda alta', () => {
        const result = (0, calculate_1.calculateRentalPJ)({
            monthlyRevenue: 12000,
            monthsInvoiced: 12,
            accountingCostMonthly: 400,
        });
        expect(result.effectiveTaxRate).toBeLessThan(0.20);
    });
    test('Custos contábeis impactam carga efetiva', () => {
        const semContador = (0, calculate_1.calculateRentalPJ)({
            monthlyRevenue: 8000,
            monthsInvoiced: 12,
            accountingCostMonthly: 0,
        });
        const comContador = (0, calculate_1.calculateRentalPJ)({
            monthlyRevenue: 8000,
            monthsInvoiced: 12,
            accountingCostMonthly: 600,
        });
        expect(comContador.totalTaxPaid)
            .toBeGreaterThan(semContador.totalTaxPaid);
    });
});
