import prisma from '../lib/prisma';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = async (name: string, email: string, passwordHash: string) => {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });
};
