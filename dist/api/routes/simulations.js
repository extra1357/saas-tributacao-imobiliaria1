"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulationsRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = __importDefault(require("../../services/prisma"));
exports.simulationsRouter = (0, express_1.Router)();
exports.simulationsRouter.get("/", auth_1.authenticate, async (req, res) => {
    const simulations = await prisma_1.default.simulation.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    return res.json(simulations);
});
exports.simulationsRouter.get("/:id", auth_1.authenticate, async (req, res) => {
    const id = String(req.params.id);
    const simulation = await prisma_1.default.simulation.findFirst({
        where: { id, userId: req.userId },
    });
    if (!simulation)
        return res.status(404).json({ error: "Simulação não encontrada." });
    return res.json(simulation);
});
exports.simulationsRouter.delete("/:id", auth_1.authenticate, async (req, res) => {
    const id = String(req.params.id);
    const simulation = await prisma_1.default.simulation.findFirst({
        where: { id, userId: req.userId },
    });
    if (!simulation)
        return res.status(404).json({ error: "Simulação não encontrada." });
    await prisma_1.default.simulation.delete({ where: { id } });
    return res.json({ deleted: true });
});
