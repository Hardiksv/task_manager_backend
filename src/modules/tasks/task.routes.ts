import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "./task.controller";

const router = Router();

router.post("/", authenticate, createTask);
router.get("/", authenticate, getTasks);
router.patch("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);
router.patch("/:id/toggle", authenticate, toggleTask);

export default router;
