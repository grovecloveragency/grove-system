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

export const editUser = async (email, name) => {
  const existingUser = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    throw new Error("User does not exists");
  }

  return await prisma.users.update({
    where: {
      email,
    },
    data: {
      name,
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

export const getUser = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User does not exists");
  }

  return user;
};
