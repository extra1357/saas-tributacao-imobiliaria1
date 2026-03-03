"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const pf_1 = require("./routes/pf");
const pj_1 = require("./routes/pj");
const compare_1 = require("./routes/compare");
const breakeven_1 = require("./routes/breakeven");
const auth_1 = require("./routes/auth");
const simulations_1 = require("./routes/simulations");
const stripe_1 = require("./routes/stripe");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
// Webhook do Stripe precisa do raw body — deve vir ANTES do express.json()
app.use("/api/stripe/webhook", express_1.default.raw({ type: "application/json" }));
app.use(express_1.default.json());
app.use(express_1.default.static(require("path").join(__dirname, "../../public")));
app.get("/", (_req, res) => {
    res.sendFile(require("path").join(__dirname, "../../public/index.html"));
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok", version: "1.0.0" });
});
app.use("/api/auth", auth_1.authRouter);
app.use("/api/stripe", stripe_1.stripeRouter);
app.use("/api/pf", pf_1.pfRouter);
app.use("/api/pj", pj_1.pjRouter);
app.use("/api/compare", compare_1.compareRouter);
app.use("/api/breakeven", breakeven_1.breakevenRouter);
app.use("/api/simulations", simulations_1.simulationsRouter);
app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada." });
});
app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
exports.default = app;
