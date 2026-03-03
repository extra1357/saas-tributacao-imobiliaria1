"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPlan = checkPlan;
const prisma_1 = __importDefault(require("../../services/prisma"));
const FREE_LIMIT = 3; // simulações por mês
async function checkPlan(req, res, next) {
    // Se não está logado, permite (sem salvar no histórico)
    if (!req.userId)
        return next();
    const user = await prisma_1.default.user.findUnique({ where: { id: req.userId } });
    if (!user)
        return next();
    // PRO: sem limite
    if (user.plan === "PRO")
        return next();
    // FREE: verifica limite mensal
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const count = await prisma_1.default.simulation.count({
        where: {
            userId: user.id,
            createdAt: { gte: startOfMonth },
        },
    });
    if (count >= FREE_LIMIT) {
        return res.status(403).json({
            error: "Limite mensal atingido.",
            code: "UPGRADE_REQUIRED",
            limit: FREE_LIMIT,
            used: count,
        });
    }
    return next();
}
