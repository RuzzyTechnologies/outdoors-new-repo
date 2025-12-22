import { Request, Response, NextFunction } from "express";

import { AdminController as AC, AuthenticatedRequest } from "../types";
import { AdminService } from "../services/admin.service";

import { BadRequest } from "../utils/error";

export class AdminController implements AC {
  private adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * @openapi
   * /api/v1/admin/signup:
   *   post:
   *     summary: Administrator signup
   *     description: Create an administrator account
   *     tags:
   *       - Admin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/LogAdminRequest"
   *     responses:
   *       201:
   *         description: Admin logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/AdminResponse"
   *       400:
   *         description: Invalid request payload
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *
   */

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

  /**
   * @openapi
   * /api/v1/admin/login:
   *   post:
   *     summary: Administrator login
   *     description: Log in to an administrator account
   *     tags:
   *       - Admin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/LoginAdminRequest"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/AdminResponse"
   *       400:
   *         description: Invalid credentials or malformed request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

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

  /**
   * @openapi
   * /api/v1/admin/logout:
   *   post:
   *     summary: Administrator logout
   *     description: Logs out the currently authenticated administrator
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LogoutResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

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

  /**
   * @openapi
   * /api/v1/admin/logoutAll:
   *   post:
   *     summary: Administrator logout
   *     description: Logs out the currently authenticated administrator from all registered devices
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LogoutResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */
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

  /**
   * @openapi
   * /api/v1/admin/profile:
   *   get:
   *     summary: Administrator profile
   *     description: Fetches admin profile/data
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Fetch successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/AdminResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */
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

  /**
   * @openapi
   * /api/v1/admin/updateInfo:
   *   patch:
   *     summary: Update administrator profile
   *     description: Update one or more administrator fields
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdateAdminRequest"
   *     responses:
   *       200:
   *         description: Admin updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/AdminResponse"
   *       400:
   *         description: Empty or invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

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

      if (req.admin) {
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
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/admin/updatePassword:
   *   patch:
   *     summary: Update administrator profile
   *     description: Update one or more administrator fields
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdatePasswordRequest"
   *     responses:
   *       200:
   *         description: Admin updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/AdminResponse"
   *       400:
   *         description: Empty or invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async updateAdminPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { password } = req.body;
      if (!password)
        throw new BadRequest("Bad Request. Fields (password) cannot be empty");

      if (req.admin) {
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
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/admin/deleteAdmin:
   *   delete:
   *     summary: Delete administrator account
   *     description: Permanently delete the currently authenticated administrator account
   *     tags:
   *       - Admin
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Admin deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeleteAdminResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async deleteAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.admin) {
        await this.adminService.deleteAdmin(req.admin._id as string);
        res.status(200).json({
          status: 200,
          message: "Admin successfully deleted!",
        });
      }
    } catch (e) {
      next(e);
    }
  }
}
