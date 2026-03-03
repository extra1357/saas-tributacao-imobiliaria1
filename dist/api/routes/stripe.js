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
exports.stripeRouter = void 0;
const express_1 = __importStar(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = __importDefault(require("../../services/prisma"));
const auth_1 = require("../middleware/auth");
exports.stripeRouter = (0, express_1.Router)();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
});
const PRICE_ID = process.env.STRIPE_PRICE_ID;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL || "https://saas-tributacao-imobiliaria.vercel.app";
// POST /api/stripe/checkout — cria sessão de pagamento
exports.stripeRouter.post("/checkout", auth_1.authenticate, async (req, res) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: req.userId } });
    if (!user)
        return res.status(404).json({ error: "Usuário não encontrado." });
    if (user.plan === "PRO") {
        return res.status(400).json({ error: "Você já é PRO." });
    }
    let customerId = user.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: { userId: user.id },
        });
        customerId = customer.id;
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customerId },
        });
    }
    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: PRICE_ID, quantity: 1 }],
        success_url: `${APP_URL}?upgrade=success`,
        cancel_url: `${APP_URL}?upgrade=cancelled`,
        locale: "pt-BR",
        metadata: { userId: user.id },
    });
    return res.json({ url: session.url });
});
// POST /api/stripe/webhook — Stripe notifica eventos
exports.stripeRouter.post("/webhook", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook error:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            if (userId && session.subscription) {
                await prisma_1.default.user.update({
                    where: { id: userId },
                    data: {
                        plan: "PRO",
                        stripeSubscriptionId: session.subscription,
                    },
                });
            }
            break;
        }
        case "customer.subscription.deleted": {
            const sub = event.data.object;
            await prisma_1.default.user.updateMany({
                where: { stripeSubscriptionId: sub.id },
                data: { plan: "FREE", stripeSubscriptionId: null },
            });
            break;
        }
        case "invoice.payment_failed": {
            // Na versão 2026-02-25.clover, usa parent ao invés de subscription
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
            if (subscriptionId) {
                await prisma_1.default.user.updateMany({
                    where: { stripeSubscriptionId: subscriptionId },
                    data: { plan: "FREE" },
                });
            }
            break;
        }
    }
    return res.json({ received: true });
});
// GET /api/stripe/portal — cliente gerencia assinatura
exports.stripeRouter.get("/portal", auth_1.authenticate, async (req, res) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: req.userId } });
    if (!user?.stripeCustomerId) {
        return res.status(400).json({ error: "Nenhuma assinatura encontrada." });
    }
    const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: APP_URL,
    });
    return res.json({ url: session.url });
});
