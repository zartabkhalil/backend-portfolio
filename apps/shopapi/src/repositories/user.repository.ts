import { Prisma, User } from "@prisma/client";
import { USERROLES } from "../config/constant";
import prisma from "../config/db";

export default class UserRepoistory {
  //:::setters
  createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({
      data,
    });
  };

  //:::gettters
  findByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  };

  countCustomers = async (): Promise<number> => {
    return prisma.user.count({
      where: {
        role: USERROLES.CUSTOMER,
      },
    });
  };
}
