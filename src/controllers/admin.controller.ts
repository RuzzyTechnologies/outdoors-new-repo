import { Request, Response, NextFunction } from "express";

import { AdminController as AC, AuthenticatedRequest } from "../types";
import { AdminService } from "../services/admin.service";

import { BadRequest } from "../utils/error";

export class AdminController implements AC {
  private adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, username, email, password } = req.body;

      if (!firstName || !lastName || !username || !email || !password)
        throw new BadRequest(
          "Bad Request. Fields (firstName, lastName, username, email, password) cannot be empty!"
        );

      const admin = await this.adminService.createAdmin({
        firstName,
        lastName,
        email,
        password,
        username,
      });

      res.status(201).json({
        status: 201,
        message: "Admin created successfully!",
        data: {
          admin,
        },
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

      const { admin, token } = await this.adminService.login({
        email,
        password,
      });

      res.status(200).json({
        status: 200,
        message: "Admin logged in successfully",
        data: {
          admin,
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await this.adminService.logout(req);
      res.status(200).json({
        status: 200,
        message: "Admin successfully logged out!",
      });
    } catch (e) {
      next(e);
    }
  }

  async logoutFromAllDevices(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.adminService.logoutFromAllDevices(req);
      res.status(200).json({
        status: 200,
        message: "Admin logged out from all devices",
      });
    } catch (e) {
      next(e);
    }
  }

  async getAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        status: 200,
        message: "Admin fetched successfully!",
        data: {
          admin: req.admin,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async updateAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. One of fields (username, firstName, and lastName) cannot be empty"
        );
      const { firstName, lastName, username } = req.body;

      const updatedAdmin = await this.adminService.updateAdminInfo(
        req.admin._id as string,
        { firstName, lastName, username }
      );

      res.status(200).json({
        status: 200,
        message: "Admin successfully updated!",
        data: {
          admin: updatedAdmin,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async updateAdminPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (Object.keys(req.body).length === 0)
        throw new BadRequest("Bad Request. Fields (password) cannot be empty");
      const { password } = req.body;

      const updatedAdmin = await this.adminService.updatePassword(
        req.admin._id as string,
        password
      );

      res.status(200).json({
        status: 200,
        message: "Admin successfully updated!",
        data: {
          admin: updatedAdmin,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.adminService.deleteAdmin(req.admin._id as string);
      res.status(200).json({
        status: 200,
        message: "Admin successfully deleted!",
      });
    } catch (e) {
      next(e);
    }
  }
}
