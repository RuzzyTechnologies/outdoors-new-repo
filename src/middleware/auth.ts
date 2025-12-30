import { NextFunction, Response } from "express";
import { AuthenticatedRequest, AuthRequest } from "../types";
import { Unauthorized } from "../utils/error";
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

  auth = async (
    req: AuthenticatedRequest & AuthRequest,
    _res: Response,
    next: NextFunction
  ) => {
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
    } catch (e: any) {
      if (e.name === "TokenExpiredError")
        throw new Unauthorized("Please authenticate");
      next(e);
    }
  };

  private async tokenValidator(token: string) {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (this.owner === "admin") {
      const { _id, username } = decoded;
      if (!_id || !username) throw new Unauthorized("Please authenticate!");
      const admin = await this.adminRepository.findOne({
        _id,
        username,
        "tokens.token": token,
      });

      if (!admin) throw new Unauthorized("Please authenticate!");
      return admin.toJSON();
    }

    const { _id, email } = decoded;
    if (!_id || !email) throw new Unauthorized("Please authenticate!");
    const user = await this.userRepository.findOne({
      _id,
      email,
      "tokens.token": token,
    });

    if (!user) throw new Unauthorized("Please authenticate!");

    return user.toJSON();
  }
}
