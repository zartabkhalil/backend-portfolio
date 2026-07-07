import { Profile, User } from "@prisma/client";

type UserWithProfile = User & {
  profile?: Profile | null;
};

export function serializeUser(user: UserWithProfile) {
  const { password, otp, refreshToken, otpExpiry, ...safeUser } = user;
  return safeUser;
}

export const serializeUsers = (users: UserWithProfile[]) =>
  users.map(serializeUser);
