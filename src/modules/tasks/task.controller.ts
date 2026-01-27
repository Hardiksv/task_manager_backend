import { Request, Response } from "express";
import * as taskService from "./task.service";

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const task = await taskService.createTask(userId, req.body);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tasks = await taskService.getTasks(userId, req.query);
    res.json(tasks);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const task = await taskService.updateTask(
      userId,
      req.params.id as string,
      req.body
    );
    res.json(task);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await taskService.deleteTask(
      userId,
      req.params.id as string
    );
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const toggleTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const task = await taskService.toggleTask(
      userId,
      req.params.id as string
    );
    res.json(task);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
