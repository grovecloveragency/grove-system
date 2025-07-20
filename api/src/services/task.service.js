import { prisma } from "../lib/db.js";
import { Status } from "@prisma/client";
import { createNotification } from "../services/notification.service.js";

export const createTask = async (
  title,
  description,
  deadline,
  priority,
  usersId
) => {
  const existingTask = await prisma.tasks.findUnique({
    where: {
      title,
    },
  });

  if (existingTask) {
    throw new Error("Task already exists");
  }

  const task = await prisma.tasks.create({
    data: {
      title,
      description,
      deadline,
      priority,
      usersId,
    },
  });

  await createNotification(title, `Task created`, usersId);

  return task;
};

export const readAllActiveTasks = async (usersId) => {
  return await prisma.tasks.findMany({
    where: {
      usersId,
      status: Status.ACTIVE,
    },
  });
};

export const readAllFailedTasks = async (usersId) => {
  return await prisma.tasks.findMany({
    where: {
      usersId,
      status: Status.FAILED,
    },
  });
};

export const readAllCompletedTasks = async (usersId) => {
  return await prisma.tasks.findMany({
    where: {
      usersId,
      status: Status.COMPLETED,
    },
  });
};

export const completeTask = async (usersId, taskId) => {
  const task = await prisma.tasks.update({
    where: {
      id: taskId,
      usersId,
    },
    data: {
      status: Status.COMPLETED,
    },
  });

  await createNotification(`Task completed`, `Has completed the task`, usersId);

  return task;
};

export const deleteTask = async (usersId, taskId) => {
  const task = await prisma.tasks.delete({
    where: {
      id: taskId,
      usersId,
    },
  });

  await createNotification(`Task deleted`, `Has deleted the task`, usersId);

  return task;
};
