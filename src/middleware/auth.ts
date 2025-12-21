import { NextFunction, Response } from "express";
import { AuthenticatedRequest, AuthRequest } from "../types";
import { NotFound, Unauthorized } from "../utils/error";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin";
import { User } from "../models/user";

export class Auth {
  private adminRepository;
  private userRepository;
  private owner;

  constructor(owner: string = "admin") {
    this.adminRepository = Admin;
    this.userRepository = User;
    this.owner = owner;
  }

  async auth(
    req: AuthenticatedRequest & AuthRequest,
    _res: Response,
    next: NextFunction
  ) {
    try {
      const header = req.headers.authorization;

      if (!header || !header.startsWith("Bearer "))
        throw new Unauthorized("Please authenticate");

      const token = header.split(" ")[1];
      if (!token) throw new Unauthorized("Please authenticate");

      const owner: any = await this.tokenValidator(token);

      if (this.owner === "user") {
        req.user = owner;
        req.token = token;
      }
      if (this.owner === "admin") {
        req.admin = owner;
        req.token = token;
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  private async tokenValidator(token: string) {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (this.owner === "admin") {
      const { _id, username } = decoded;
      const admin = await this.adminRepository.findOne({
        _id,
        username,
      });

      if (!admin) throw new NotFound("Admin doesn't exist");

      const { password, ...safeAdmin } = admin;
      return safeAdmin;
    }

    const { _id, email } = decoded;
    const user = await this.userRepository.findOne({
      _id,
      email,
    });

    if (!user) throw new NotFound("User doesn't exist");

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
