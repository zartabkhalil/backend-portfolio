import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
export default class UserController {
  private userService: AuthService;
  constructor() {
    this.userService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, adminSecret } = req.body;
    const result = await this.userService.register({
      name,
      email,
      password,
      adminSecret,
    });
    return res.status(201).json({
      success: true,
      message: "User registered",
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
    return res.status(200).json({
      message: "Success",
      user: null,
    });
  };

  //method to verify token
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: "Success",
    });
    //generat a new token
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: "User Successfully logout",
    });
  };
}
