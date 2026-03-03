"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../services/prisma"));
const validate_1 = require("../middleware/validate");
exports.authRouter = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
const RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    name: zod_1.z.string().optional(),
});
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(1, "Senha obrigatória"),
});
// POST /api/auth/register
exports.authRouter.post("/register", (0, validate_1.validate)(RegisterSchema), async (req, res) => {
    const { email, password, name } = req.body;
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: "Email já cadastrado." });
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: { email, password: hashed, name },
        select: { id: true, email: true, name: true, createdAt: true },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({ user, token });
});
// POST /api/auth/login
exports.authRouter.post("/login", (0, validate_1.validate)(LoginSchema), async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: "Email ou senha inválidos." });
    }
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: "Email ou senha inválidos." });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({
        user: { id: user.id, email: user.email, name: user.name },
        token,
    });
});
// GET /api/auth/me
exports.authRouter.get("/me", async (req, res) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido." });
    }
    try {
        const token = header.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, name: true, createdAt: true },
        });
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado." });
        return res.json(user);
    }
    catch {
        return res.status(401).json({ error: "Token inválido." });
    }
});
