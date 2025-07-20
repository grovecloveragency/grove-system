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

export const getAllNotifications = async (usersId) => {
  return await prisma.notifications.findMany({
    where: {
      usersId,
      isRead: false,
    },
  });
};

export const readNotification = async (notificationId) => {
  return await prisma.notifications.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};

export const deleteNotification = async (notificationId) => {
  return await prisma.notifications.delete({
    where: {
      id: notificationId,
    },
  });
};
