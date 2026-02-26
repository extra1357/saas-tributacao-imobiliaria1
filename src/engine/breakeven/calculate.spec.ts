import { calculateBreakeven } from "./calculate";

const noDeductions = { iptu:0, condominio:0, administracao:0, seguro:0, juroFinanciamento:0, despesasCobranca:0 };

describe("Engine Break-even", () => {
  it("retorna ponto de virada dentro do intervalo padrão", () => {
    const result = calculateBreakeven({ deductions: noDeductions });
    expect(result.breakevenMonthly).not.toBeNull();
    expect(result.breakevenMonthly!).toBeGreaterThanOrEqual(1000);
  });

  it("deduções elevam o break-even (PF fica mais competitivo)", () => {
    const semDeducao = calculateBreakeven({ deductions: noDeductions });
    const comDeducao = calculateBreakeven({ deductions: { ...noDeductions, iptu: 500, condominio: 300 } });
    // Com deduções, PF paga menos → PJ precisa de aluguel ainda maior para vencer
    expect(comDeducao.breakevenMonthly!).toBeGreaterThanOrEqual(semDeducao.breakevenMonthly!);
  });

  it("custo de contador eleva o break-even de PJ", () => {
    const semContador = calculateBreakeven({ deductions: noDeductions });
    const comContador = calculateBreakeven({ deductions: noDeductions, accountingCostMonthly: 1000 });
    // Contador encarece PJ → PJ só vence em aluguéis mais altos
    expect(comContador.breakevenMonthly!).toBeGreaterThanOrEqual(semContador.breakevenMonthly!);
  });
});
