import bcrypt from "bcryptjs";
import { USERROLES } from "../config/constant";
import { AppError } from "../lib/appError.lib";
import JwtService from "../lib/jwt.lib";
import UserRepoistory from "../repositories/user.repository";
import { CreateUserInput, LoginInput } from "../types/auth.types";

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

    //::create access token
    const token = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const { password, ...safeUser } = user;

    return { accessToken: token, user: safeUser };
  };
  register = async (data: CreateUserInput) => {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("User already exists", 409);
    }

    //:::: hashedPassword
    const hashedPassword = await bcrypt.hash(data.password, 10);

    //::Create Account if check passed alos matched the admin secret string for role
    if (data.adminSecret != null) {
      const secret = process.env.ADMIN_SECRET;
      if (!secret) throw new Error("ADMIN_SECRET is not set");
      if (data.adminSecret !== secret) {
        throw new AppError("Invalid admin secret", 403);
      }
      const { adminSecret, ...newData } = data;
      const result = await this.userRepository.createUser({
        ...newData,
        role: USERROLES.ADMIN,
        password: hashedPassword,
      });
      const { password, ...safeUser } = result;
      return safeUser;
    }
    const { adminSecret, ...cleanData } = data;
    const result = await this.userRepository.createUser({
      ...cleanData,
      password: hashedPassword,
    });
    const { password, ...safeUser } = result;
    return safeUser;
  };
}
