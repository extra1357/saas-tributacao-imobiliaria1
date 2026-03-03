"use strict";
// src/engine/pf/irpfTable.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRPF_BRACKETS = void 0;
exports.IRPF_BRACKETS = [
    { upTo: 2259.20, rate: 0, deduction: 0 },
    { upTo: 2826.65, rate: 0.075, deduction: 169.44 },
    { upTo: 3751.05, rate: 0.15, deduction: 381.44 },
    { upTo: 4664.68, rate: 0.225, deduction: 662.77 },
    { upTo: Infinity, rate: 0.275, deduction: 896.00 },
];
