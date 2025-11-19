import { Admin } from "../models/admin";
import { Conflict, InternalServerError, NotFound } from "../utils/error";
import type { adminOptions, loginOptions, adminUpdateFields } from "../types";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";

export class AdminService implements AdminService {
  async createAdmin(payload: adminOptions) {
    try {
      const { firstName, lastName, username, email, password } = payload;

      const findExistingEmail = await Admin.findOne({ email });

      if (findExistingEmail)
        throw new Conflict("An administrator with this email already exists");

      const findExistingUsername = await Admin.findOne({
        username,
      });

      if (findExistingUsername)
        throw new Conflict(
          "An administrator with this username already exists"
        );

      const admin = new Admin({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      await admin.save();

      // logger.info("Admin created...");
    } catch (e: any) {
      if (e instanceof Conflict) throw e;
      // logger.error("Error creating admin");
      throw new InternalServerError(`Error creating admin, ${e}`);
    }
  }

  async login(payload: loginOptions) {
    try {
      const { email, loginPassword } = payload;
      const admin = await Admin.findByCredentials({
        email,
        loginPassword,
      });
      const token = await admin.generateAuthToken();

      logger.info("User successfully logged in...");
      return { admin, token };
    } catch (e: any) {
      logger.error("Error logging admin in...", e);
      throw new InternalServerError(`Error logging admin in... ${e}`);
    }
  }

  async logout(req: any) {
    try {
      req.user.tokens = req.user.tokens.filter((token: any) => {
        token.token !== req.token;
      });

      await req.user.save();
      logger.info("User successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging admin out...");
      throw new InternalServerError(`Error logging admin out...${e}`);
    }
  }

  async logoutFromAllDevices(req: any) {
    try {
      req.user.tokens = [];

      await req.user.save();
      logger.info("User successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging admin out...");
      throw new InternalServerError(`Error logging admin out...${e}`);
    }
  }

  async updateAdminInfo(id: string, payload: adminUpdateFields) {
    try {
      const _id = new ObjectId(String(id));
      const admin = await Admin.findOneAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
      });
      if (!admin) throw new NotFound(`Admin doesn't exist`);

      logger.info("Admin info updated...");
      return admin;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error updating fields...`);
      throw new InternalServerError(`Error updating fields...${e}`);
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      const _id = new ObjectId(String(id));
      const admin = await Admin.findOneAndUpdate(
        _id,
        { password },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!admin) throw new NotFound(`Admin doesn't exist`);

      logger.info("Admin password updated...");
      return admin;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error updating password...`);
      throw new InternalServerError(`Error updating password...${e}`);
    }
  }

  async deleteAdmin(id: string) {
    try {
      const _id = new ObjectId(String(id));
      const admin = await Admin.findByIdAndDelete(_id);
      if (!admin) throw new NotFound(`Admin doesn't exist`);

      logger.info("Admin successfully deleted");
      return admin;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error deleting admin...`);
      throw new InternalServerError(`Error deleting admin...${e}`);
    }
  }

  async createOTP() {}

  async verifyOTP() {}
}
