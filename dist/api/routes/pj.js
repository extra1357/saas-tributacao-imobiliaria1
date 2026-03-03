"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pjRouter = void 0;
const express_1 = require("express");
const engine_1 = require("../../engine");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../schemas");
const prisma_1 = __importDefault(require("../../services/prisma"));
const toJson = (obj) => JSON.parse(JSON.stringify(obj));
exports.pjRouter = (0, express_1.Router)();
exports.pjRouter.post("/", (0, validate_1.validate)(schemas_1.PJSchema), async (req, res) => {
    const result = (0, engine_1.calculateRentalPJ)(req.body);
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
        try {
            const jwt = await Promise.resolve().then(() => __importStar(require("jsonwebtoken")));
            const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
            const payload = jwt.default.verify(header.split(" ")[1], secret);
            await prisma_1.default.simulation.create({
                data: { userId: payload.userId, type: "PJ", input: toJson(req.body), result: toJson(result) },
            });
        }
        catch { }
    }
    return res.json(result);
});
