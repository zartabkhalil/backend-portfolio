import { AccountStatus, User, Role as USERROLES } from "@prisma/client";
import prisma from "../config/db";
import { CreateUserRepositoryInput } from "../types/auth.types";
export default class UserRepoistory {
  //:::setters
  createUser = async (data: CreateUserRepositoryInput): Promise<User> => {
    return prisma.$transaction(async (tx) => {
      const user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: data.role,
          otp: data.otp,
          otpExpiry: data.otpExpiry,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          username: data.username,
        },
      });

      return user;
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
        role: USERROLES.USER,
      },
    });
  };

  async verifyAccount(userId: number) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
        otp: null,
        otpExpiry: null,
      },
    });
  }

  async findById(userId: number) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }

  async getUserByRefreshToken(refreshToken: string) {
    return prisma.user.findUnique({
      where: {
        refreshToken,
      },
    });
  }

  async removeRefreshToken(userId: number) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}
