import { prisma } from "../lib/db.js";

export const createNotification = async (title, message, usersId) => {
  const existingUser = await prisma.users.findUnique({
    where: {
      usersId,
    },
  });

  if (!existingUser) {
    throw new Error("User does not exist");
  }

  return await prisma.notifications.create({
    data: {
      title,
      message,
      usersId,
    },
  });
};

export const readNotifications = async (usersId) => {
  return await prisma.notifications.findMany({
    where: {
      usersId,
      isRead: false,
    },
  });
};
