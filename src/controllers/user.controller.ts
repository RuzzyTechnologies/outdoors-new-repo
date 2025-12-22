import { Request, Response, NextFunction } from "express";

import { UserController as UC, AuthRequest } from "../types";
import { UserService } from "../services/user.service";

import { BadRequest } from "../utils/error";

export class UserController implements UC {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * @openapi
   * /api/v1/users/signup:
   *   post:
   *     summary: User signup
   *     description: Create an user account
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UserlogRequest"
   *     responses:
   *       201:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserResponse"
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

  /**
   * @openapi
   * /api/v1/users/logoutAll:
   *   post:
   *     summary: User logout
   *     description: Logs out the currently authenticated User from all registered devices
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserLogoutResponse"
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

  /**
   * @openapi
   * /api/v1/users/login:
   *   post:
   *     summary: User login
   *     description: Log in to an user account
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UserLoginRequest"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserResponse"
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

  /**
   * @openapi
   * /api/v1/users/logout:
   *   post:
   *     summary: User logout
   *     description: Logs out the currently authenticated user
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserLogoutResponse"
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

  /**
   * @openapi
   * /api/v1/users/profile:
   *   get:
   *     summary: User profile
   *     description: Fetches user profile/data
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Fetch successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserResponse"
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

  /**
   * @openapi
   * /api/v1/users/updateInfo:
   *   patch:
   *     summary: Update user profile
   *     description: Update one or more user fields
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdateUserRequest"
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserResponse"
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

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. One of fields (fullname, phoneNo, companyName and position) cannot be empty"
        );
      const { fullname, phoneNo, companyName, position } = req.body;

      if (req.user) {
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
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/users/updatePassword:
   *   patch:
   *     summary: Update user profile
   *     description: Update one or more user fields
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UpdateUserPasswordRequest"
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserResponse"
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
      if (req.user) {
        await this.userService.updatePassword(req.user._id as string, password);
        res.status(200).json({
          status: 200,
          message: "User password successfully updated!",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/users/delete:
   *   delete:
   *     summary: Soft delete user account
   *     description: Permanently delete the currently authenticated user account
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeleteUserResponse"
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
  async softDeleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await this.userService.deleteUser(req.user.id as string);
        res.status(200).json({
          status: 200,
          message: "User deleted successfully",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/users/avatar:
   *   post:
   *     summary: Upload user avatar
   *     description: Upload and update the authenticated user's avatar image
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: "#/components/schemas/UploadAvatarRequest"
   *     responses:
   *       200:
   *         description: Avatar uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UploadAvatarResponse"
   *       400:
   *         description: File not found or invalid upload
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

  async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new BadRequest("Bad Request. File not found");

      if (req.user) {
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
      }
    } catch (e) {
      next(e);
    }
  }
}
