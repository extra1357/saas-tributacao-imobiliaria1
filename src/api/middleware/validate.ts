// src/api/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({
        campo: e.path.join("."),
        mensagem: e.message,
      }));
      return res.status(400).json({ error: "Dados inválidos.", detalhes: errors });
    }
    req.body = parsed.data;
    return next();
  };
}
