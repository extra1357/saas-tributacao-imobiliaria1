"use strict";
// src/engine/index.ts
// Ponto de entrada único da engine tributária.
// Todo consumidor externo (API, serviços, frontend) importa daqui.
// Nunca importar diretamente de subpastas fora da engine.
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBreakeven = exports.comparePFvsPJ = exports.calculateRentalPJ = exports.calculateRentalPF = void 0;
var pf_1 = require("./pf");
Object.defineProperty(exports, "calculateRentalPF", { enumerable: true, get: function () { return pf_1.calculateRentalPF; } });
var pj_1 = require("./pj");
Object.defineProperty(exports, "calculateRentalPJ", { enumerable: true, get: function () { return pj_1.calculateRentalPJ; } });
var comparador_1 = require("./comparador");
Object.defineProperty(exports, "comparePFvsPJ", { enumerable: true, get: function () { return comparador_1.comparePFvsPJ; } });
var breakeven_1 = require("./breakeven");
Object.defineProperty(exports, "calculateBreakeven", { enumerable: true, get: function () { return breakeven_1.calculateBreakeven; } });
