import UserModel from "../models/user.model.js";

export default class UserRepository {
  //get a user

  //SETTERS
  async createNewUser(email, password, name) {
    try {
      const user = await UserModel.create({ email, password, name });
      return user;
    } catch (error) {
      console.error("Error while creating new  user :", error);
      throw error;
    }
  }
  async saveOtp(id, newOtp, otpExpiry) {
    try {
      const user = await UserModel.findById(id);
      user.resetpasswordOTP = newOtp;
      user.resetPasswordOTPExpiry = otpExpiry;
      return await user.save();
    } catch (error) {
      console.error("Error while Saving Otp :", error);
      throw error;
    }
  }

  async resetPassword(id, newPassword) {
    try {
      const user = await UserModel.findById(id);
      user.password = newPassword;
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      return await user.save();
    } catch (error) {
      console.error("Error while Saving New Password :", error);
      throw error;
    }
  }

  //save access token in db
  async saveAccessToken(id, token) {
    try {
      const user = await UserModel.findById(id);
      user.refreshToken = token;
      return await user.save();
    } catch (error) {
      console.error("Error while Saving Access Token :", error);
      throw error;
    }
  }

  //GETTERS
  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error fetching user By email:", error);
      throw error;
    }
  }

  // Used only for auth flows (login, forgot/reset password) — includes hashed password
  async getUserByEmailWithPassword(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error fetching user By email (with password):", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      console.error("Error while fetching user by id :", error);
      throw error;
    }
  }

  async getUserByToken(refreshToken) {
    try {
      return await UserModel.findOne({ refreshToken });
    } catch (error) {
      console.error("Error while fetching user by refresh Token :", error);
      throw error;
    }
  }

  //DESTORYER
  async removeRefreshToken(id) {
    try {
      const user = await UserModel.findById(id);
      user.refreshToken = undefined;
      await user.save();
      return user;
    } catch (error) {
      console.error("Error while fetching user by refresh Token :", error);
      throw error;
    }
  }
}
