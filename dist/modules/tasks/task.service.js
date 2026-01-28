"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleTask = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const createTask = async (userId, { title }) => {
    if (!title) {
        throw new Error("Title is required");
    }
    return prisma_1.default.task.create({
        data: {
            title,
            userId,
        },
    });
};
exports.createTask = createTask;
const getTasks = async (userId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const completed = query.completed !== undefined
        ? query.completed === "true"
        : undefined;
    const search = query.search;
    return prisma_1.default.task.findMany({
        where: {
            userId,
            ...(completed !== undefined && { completed }),
            ...(search && {
                title: { contains: search, mode: "insensitive" },
            }),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};
exports.getTasks = getTasks;
const updateTask = async (userId, taskId, data) => {
    const task = await prisma_1.default.task.findFirst({
        where: { id: taskId, userId },
    });
    if (!task) {
        throw new Error("Task not found");
    }
    return prisma_1.default.task.update({
        where: { id: taskId },
        data,
    });
};
exports.updateTask = updateTask;
const deleteTask = async (userId, taskId) => {
    const task = await prisma_1.default.task.findFirst({
        where: { id: taskId, userId },
    });
    if (!task) {
        throw new Error("Task not found");
    }
    await prisma_1.default.task.delete({
        where: { id: taskId },
    });
    return { message: "Task deleted" };
};
exports.deleteTask = deleteTask;
const toggleTask = async (userId, taskId) => {
    const task = await prisma_1.default.task.findFirst({
        where: { id: taskId, userId },
    });
    if (!task) {
        throw new Error("Task not found");
    }
    return prisma_1.default.task.update({
        where: { id: taskId },
        data: { completed: !task.completed },
    });
};
exports.toggleTask = toggleTask;
