import { prisma } from "../lib/db.js";

export const createNotification = async (title, message, usersId) => {
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
