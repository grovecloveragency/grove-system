import { prisma } from "../lib/db.js";

export const createUser = async (name, email) => {
  const existingUser = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  return await prisma.users.create({
    data: {
      name,
      email,
    },
  });
};

export const deleteUser = async (email) => {
  const existingUser = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new Error("User does not exists");
  }

  return await prisma.users.delete({
    where: {
      email,
    },
  });
};
