import express from "express";
import { pfRouter } from "./routes/pf";
import { pjRouter } from "./routes/pj";
import { compareRouter } from "./routes/compare";
import { breakevenRouter } from "./routes/breakeven";
import { authRouter } from "./routes/auth";
import { simulationsRouter } from "./routes/simulations";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static(require("path").join(__dirname, "../../public")));
app.get("/", (_req, res) => {
  res.sendFile(require("path").join(__dirname, "../../public/index.html"));
});
app.get("/", (_req, res) => {
  res.sendFile(require("path").join(__dirname, "../../public/index.html"));
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0" });
});

app.use("/api/auth", authRouter);
app.use("/api/pf", pfRouter);
app.use("/api/pj", pjRouter);
app.use("/api/compare", compareRouter);
app.use("/api/breakeven", breakevenRouter);
app.use("/api/simulations", simulationsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});

export default app;
