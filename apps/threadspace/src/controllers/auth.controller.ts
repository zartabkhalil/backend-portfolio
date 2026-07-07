import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/appError.lib";
import AuthService from "../services/auth.service";
export default class UserController {
  private userService: AuthService;
  constructor() {
    this.userService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, username, email, password, adminSecret } =
      req.body;

    const result = await this.userService.register({
      firstName,
      lastName,
      username,
      email,
      password,
      adminSecret,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  };

  //login method
  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //check if user exist with mail — must include password for bcrypt.compare
    const result = await this.userService.login({
      email,
      password,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };

  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    const result = await this.userService.verify({
      email,
      otp,
    });
    return res.status(200).json({
      success: true,
      message: "Account Verified",
      data: result,
    });
  };

  forgot = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: `OTP sent successfully `,
    });
  };

  reset = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: "Password updated successfully",
    });
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { userId } = req.user;
    const result = await this.userService.getUser(userId);
    return res.status(200).json({
      message: "Success",
      user: result,
    });
  };

  //method to verify token
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    const data = await this.userService.refreshToken(refreshToken);

    return res.status(200).json({
      message: "Success",
      data,
    });
    //generat a new token
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { userId } = req.user;
    await this.userService.logout(userId);
    return res.status(200).json({
      message: "User Successfully logout",
    });
  };
}
