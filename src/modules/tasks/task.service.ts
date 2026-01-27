import prisma from "../../config/prisma";

interface CreateTaskInput {
  title: string;
}

export const createTask = async (
  userId: string,
  { title }: CreateTaskInput
) => {
  if (!title) {
    throw new Error("Title is required");
  }

  return prisma.task.create({
    data: {
      title,
      userId,
    },
  });
};


export const getTasks = async (
  userId: string,
  query: any
) => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const completed =
    query.completed !== undefined
      ? query.completed === "true"
      : undefined;
  const search = query.search as string | undefined;

  return prisma.task.findMany({
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


export const updateTask = async (
  userId: string,
  taskId: string,
  data: { title?: string }
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};


export const deleteTask = async (
  userId: string,
  taskId: string
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted" };
};


export const toggleTask = async (
  userId: string,
  taskId: string
) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { completed: !task.completed },
  });
};
