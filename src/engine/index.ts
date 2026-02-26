// src/engine/index.ts
// Ponto de entrada único da engine tributária.
// Todo consumidor externo (API, serviços, frontend) importa daqui.
// Nunca importar diretamente de subpastas fora da engine.

// PF
export type { RentalPFInput, RentalPFResult } from "./pf";
export { calculateRentalPF } from "./pf";

// PJ
export type { RentalPJInput } from "./pj";
export { calculateRentalPJ } from "./pj";

// Comparador
export type { CompareInput, CompareResult } from "./comparador";
export { comparePFvsPJ } from "./comparador";

// Breakeven
export type { BreakevenInput, BreakevenResult } from "./breakeven";
export { calculateBreakeven } from "./breakeven";
