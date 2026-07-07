import { AccountStatus, Role as USERROLES } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AppError } from "../lib/appError.lib";
import JwtService from "../lib/jwt.lib";
import UserRepoistory from "../repositories/user.repository";
import { serializeUser } from "../serializers/user.serializer";
import { CreateUserInput, LoginInput, VerifyInput } from "../types/auth.types";
export default class AuthService {
  private userRepository: UserRepoistory;
  private jwtService: JwtService;
  constructor() {
    this.userRepository = new UserRepoistory();
    this.jwtService = new JwtService();
  }

  login = async (data: LoginInput) => {
    //:: find user if not found throw error
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Email or Password Invalid", 401);
    }

    //:: haspassword and match if not throw error
    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      throw new AppError("Email or Password Invalid", 401);
    }

    //:: ACCOUNT_STATUS is Active or not
    switch (user.accountStatus) {
      case AccountStatus.PENDING:
        throw new AppError(
          "Your account is pending verification. Please verify your email.",
          403,
          "ACCOUNT_PENDING",
        );

      case AccountStatus.INACTIVE:
        throw new AppError(
          "Your account has been INACTIVE.",
          403,
          "ACCOUNT_INACTIVE",
        );
    }

    //::create access token
    const token = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    //generate accesToken
    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    //saving: token in db
    await this.userRepository.saveRefreshToken(user.id, refreshToken);
    const { password, otp, otpExpiry, createdAt, updatedAt, ...safeUser } =
      user;

    return { accessToken: token, refreshToken, user: serializeUser(user) };
  };
  register = async (data: CreateUserInput) => {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("User already exists", 409);
    }

    //:::: hashedPassword
    const hashedPassword = await bcrypt.hash(data.password, 10);
    //generating otp
    const newOtp = crypto.randomInt(100000, 999999).toString();
    const newOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    //::Create Account if check passed alos matched the admin secret string for role
    if (data.adminSecret != null) {
      const secret = process.env.ADMIN_SECRET;
      if (!secret) throw new Error("ADMIN_SECRET is not set");
      if (data.adminSecret !== secret) {
        throw new AppError("Invalid admin secret", 403);
      }
      const { adminSecret, ...newData } = data;

      //creating -admin-account
      const result = await this.userRepository.createUser({
        ...newData,
        role: USERROLES.ADMIN,
        otp: newOtp,
        otpExpiry: newOtpExpiry,
        password: hashedPassword,
      });
      const { password, otpExpiry, createdAt, updatedAt, ...safeUser } = result;
      return safeUser;
    }

    //creating -user-account
    const { adminSecret, ...cleanData } = data;
    const result = await this.userRepository.createUser({
      ...cleanData,
      role: USERROLES.USER,
      otp: newOtp,
      otpExpiry: newOtpExpiry,
      password: hashedPassword,
    });

    //return result
    return serializeUser(result);
  };

  verify = async (data: VerifyInput) => {
    const { email, otp } = data;
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    if (user.accountStatus === AccountStatus.ACTIVE) {
      throw new AppError("Account is already verified.", 400);
    }
    if (user.accountStatus === AccountStatus.INACTIVE) {
      throw new AppError("Your account is inactive.", 403);
    }

    if (!user.otp || !user.otpExpiry) {
      throw new AppError(
        "Verification code not found. Please request a new OTP.",
        400,
      );
    }

    if (user.otpExpiry.getTime() < Date.now()) {
      throw new AppError(
        "Verification code has expired. Please request a new OTP.",
        400,
      );
    }

    if (user.otp !== otp) {
      throw new AppError("Invalid verification code.", 400);
    }

    return await this.userRepository.verifyAccount(user.id);
  };

  getUser = async (userId: number) => {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return serializeUser(user);
  };

  refreshToken = async (refreshToken: string) => {
    await this.jwtService.verifyRefreshToken(refreshToken);
    console.log("tone", refreshToken);
    //find user by refreshToken
    const user = await this.userRepository.getUserByRefreshToken(refreshToken);
    console.log("user", user);
    if (!user) {
      throw new AppError("User Not Found", 401);
    }
    //if user exist with token  then generate tokene and return it
    if (user) {
      const token = this.jwtService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      //generate accesToken
      const refreshToken = this.jwtService.generateRefreshToken({
        userId: user.id,
        role: user.role,
      });

      //saving: token in db
      const result = await this.userRepository.saveRefreshToken(
        user.id,
        refreshToken,
      );
      return serializeUser(result);
    }
    //generat a new token
  };

  logout = async (userId: number) => {
    await this.userRepository.removeRefreshToken(Number(userId));
  };
}
