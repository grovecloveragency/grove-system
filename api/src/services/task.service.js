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
