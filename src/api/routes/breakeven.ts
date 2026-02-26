import { Router, Request, Response } from "express";
import { calculateBreakeven } from "../../engine";
import { validate } from "../middleware/validate";
import { AuthRequest } from "../middleware/auth";
import { BreakevenSchema } from "../schemas";
import prisma from "../../services/prisma";

const toJson = (obj: unknown) => JSON.parse(JSON.stringify(obj));

export const breakevenRouter = Router();

breakevenRouter.post("/", validate(BreakevenSchema), async (req: AuthRequest, res: Response) => {
  const result = calculateBreakeven(req.body);

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      const jwt = await import("jsonwebtoken");
      const secret = process.env.JWT_SECRET ?? "dev-secret-change-in-production";
      const payload = jwt.default.verify(header.split(" ")[1], secret) as { userId: string };
      await prisma.simulation.create({
        data: { userId: payload.userId, type: "BREAKEVEN", input: toJson(req.body), result: toJson(result) },
      });
    } catch {}
  }

  return res.json(result);
});
