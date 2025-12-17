import { Request, Response, NextFunction } from "express";

import { UserController as UC, AuthRequest } from "../types";
import { UserService } from "../services/user.service";

import { BadRequest } from "../utils/error";

export class UserController implements UC {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phoneNo, password, companyName, position } =
        req.body;

      if (!fullName || !email || !phoneNo || !password || !companyName)
        throw new BadRequest(
          "Bad Request. Fields ( fullName, email, phoneNo, password, companyName, position) cannot be empty"
        );

      const user = await this.userService.createUser({
        fullName,
        email,
        phoneNo,
        password,
        companyName,
        position,
      });
      res.status(201).json({
        status: 200,
        message: "User successfully signed up!",
        data: {
          user,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async logoutFromAllDevices(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.userService.logoutFromAllDevices(req);
      res.status(200).json({
        status: 200,
        message: "User logged out from all devices",
      });
    } catch (e) {
      next(e);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new BadRequest(
          "Bad Request. Fields (email and password) cannot be empty"
        );

      const { user, token } = await this.userService.login({
        email,
        password,
      });

      res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        data: {
          user,
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.userService.logout(req);
      res.status(200).json({
        status: 200,
        message: "User successfully logged out!",
      });
    } catch (e) {
      next(e);
    }
  }
  async getUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        status: 200,
        message: "User fetched successfully!",
        data: {
          user: req.user,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. One of fields (fullname, phoneNo, companyName and position) cannot be empty"
        );
      const { fullname, phoneNo, companyName, position } = req.body;

      const user = await this.userService.updateUserInfo(
        req.user._id as string,
        {
          fullname,
          phoneNo,
          companyName,
          position,
        }
      );
      res.status(200).json({
        status: 200,
        message: "User info successfully updated!",
        data: {
          user,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async updateUserPassword(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { password } = req.body;
      if (password)
        throw new BadRequest(
          "Bad Request. One of fields (username, firstName, and lastName) cannot be empty"
        );

      await this.userService.updatePassword(req.user._id as string, password);
      res.status(200).json({
        status: 200,
        message: "User password successfully updated!",
      });
    } catch (e) {
      next(e);
    }
  }
  async softDeleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.userService.deleteUser(req.user.id as string);
      res.status(200).json({
        status: 200,
        message: "User deleted successfully",
      });
    } catch (e) {
      next(e);
    }
  }

  async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new BadRequest("Bad Request. File not found");
      const { user, newUrl } = await this.userService.uploadAvatar(
        req.user._id as string,
        req.file as Express.Multer.File
      );

      res.status(200).json({
        status: 200,
        message: "Avatar uplaoded successfully!",
        data: {
          user,
          avatarUrl: newUrl,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
