import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../../services/prisma";

export const simulationsRouter = Router();

simulationsRouter.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const simulations = await prisma.simulation.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return res.json(simulations);
});

simulationsRouter.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: req.userId! },
  });
  if (!simulation) return res.status(404).json({ error: "Simulação não encontrada." });
  return res.json(simulation);
});

simulationsRouter.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: req.userId! },
  });
  if (!simulation) return res.status(404).json({ error: "Simulação não encontrada." });
  await prisma.simulation.delete({ where: { id } });
  return res.json({ deleted: true });
});
