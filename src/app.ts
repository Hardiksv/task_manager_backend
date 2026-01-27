import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate } from "./middlewares/auth.middleware";
import taskRoutes from "./modules/tasks/task.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: (req as any).userId,
  });
});
export default app;
