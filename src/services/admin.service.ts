import { Admin } from "../models/admin";
import { Conflict, InternalServerError, NotFound } from "../utils/error";
import type {
  adminOptions,
  loginOptions,
  adminUpdateFields,
  AdminDocument,
} from "../types";
import { AdminService as AS } from "../types";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";

export class AdminService implements AS {
  private adminRepository;

  constructor() {
    this.adminRepository = Admin;
  }

  async createAdmin(payload: adminOptions) {
    try {
      const { firstName, lastName, username, email, password } = payload;

      const findExistingEmail = await this.adminRepository.findOne({ email });

      if (findExistingEmail)
        throw new Conflict("An administrator with this email already exists");

      const findExistingUsername = await this.adminRepository.findOne({
        username,
      });

      if (findExistingUsername)
        throw new Conflict(
          "An administrator with this username already exists"
        );

      const admin = new this.adminRepository({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      await admin.save();
      logger.info("Admin created...");
      return admin;
    } catch (e: any) {
      if (e instanceof Conflict) throw e;
      logger.error("Error creating admin");
      throw new InternalServerError(`Error creating admin`);
    }
  }

  async login(payload: loginOptions) {
    try {
      const { email, password } = payload;
      const admin = await this.adminRepository.findByCredentials({
        email,
        password,
      });
      if (!admin) {
        throw new NotFound("Wrong email/password combination");
      }
      const token = await admin.generateAuthToken();

      logger.info("Admin successfully logged in...");
      return { admin, token };
    } catch (e: any) {
      if (e instanceof NotFound) throw e;
      logger.error("Error logging admin in...", e);
      throw new InternalServerError(`Error logging admin in`);
    }
  }

  async logout(req: any) {
    try {
      const admin = await this.adminRepository.findOne({
        _id: req.admin._id,
      });

      if (!admin) throw new NotFound("Admin not found");

      admin.tokens = admin.tokens.filter(
        (token: any) => token.token !== req.token
      );
      await admin.save();

      logger.info("Admin successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging admin out...");
      throw new InternalServerError(`Error logging admin out`);
    }
  }

  async logoutFromAllDevices(req: any) {
    try {
      const admin = await this.adminRepository.findOne({
        _id: req.admin._id,
      });

      if (!admin) throw new NotFound("Admin not found");

      admin.tokens = [];
      await admin.save();
      logger.info("Admin successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging admin out...");
      throw new InternalServerError(`Error logging admin out`);
    }
  }

  async updateAdminInfo(id: ObjectId, payload: adminUpdateFields) {
    try {
      const admin = await this.adminRepository.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!admin) throw new NotFound(`Admin doesn't exist`);

      logger.info("Admin info updated...");
      return admin;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error updating admin...`);
      throw new InternalServerError(`Error updating admin`);
    }
  }

  async updatePassword(id: ObjectId, password: string) {
    try {
      const admin = await this.adminRepository.findOneAndUpdate(
        { _id: id },
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
      throw new InternalServerError(`Error updating password`);
    }
  }

  async deleteAdmin(id: ObjectId) {
    try {
      const admin = await this.adminRepository.findByIdAndDelete({ _id: id });
      if (!admin) throw new NotFound(`Admin doesn't exist`);

      logger.info("Admin successfully deleted");
      return admin;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error deleting admin...`);
      throw new InternalServerError(`Error deleting admin`);
    }
  }

  async getSpecificAdmin(id: string) {
    try {
      const _id = new ObjectId(id);
      const admin = await this.adminRepository.findOne({ _id });
      if (!admin) throw new NotFound("Admin does not exist");
      return admin;
    } catch (e) {
      logger.error(`Error fetching admin...`);
      throw e;
    }
  }
}
