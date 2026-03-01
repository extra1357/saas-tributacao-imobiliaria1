import express, { Router, Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../../services/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

export const stripeRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const PRICE_ID = process.env.STRIPE_PRICE_ID!;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const APP_URL = process.env.APP_URL || "https://saas-tributacao-imobiliaria.vercel.app";

// POST /api/stripe/checkout — cria sessão de pagamento
stripeRouter.post("/checkout", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

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
    await prisma.user.update({
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
stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "PRO",
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { plan: "FREE", stripeSubscriptionId: null },
        });
        break;
      }

      case "invoice.payment_failed": {
        // Na versão 2026-02-25.clover, usa parent ao invés de subscription
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
        if (subscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { plan: "FREE" },
          });
        }
        break;
      }
    }

    return res.json({ received: true });
  }
);

// GET /api/stripe/portal — cliente gerencia assinatura
stripeRouter.get("/portal", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: "Nenhuma assinatura encontrada." });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: APP_URL,
  });

  return res.json({ url: session.url });
});
