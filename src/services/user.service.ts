import { User } from "../models/user";
import {
  Conflict,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "../utils/error";
import type { loginOptions, userOptions, userUpdateFields } from "../types";
import { UserService as US } from "../types";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";
import { uploadMiddleware } from "../middleware/multer";

export class UserService implements US {
  private userRepository;

  constructor() {
    this.userRepository = User;
  }

  async createUser(payload: userOptions) {
    try {
      const { fullName, email, phoneNo, password, companyName, position } =
        payload;

      const findExistingEmail = await this.userRepository.findOne({
        email,
      });

      if (findExistingEmail)
        throw new Conflict("A User with this email already exists");

      const user = new this.userRepository({
        fullName,
        phoneNo,
        email,
        password,
        companyName,
        position,
      });
      await user.save();
      logger.info("User created...");
      return user;
    } catch (e: any) {
      if (e instanceof Conflict) throw e;
      logger.error("Error creating user");
      console.log(e);
      throw new InternalServerError(`Error creating user`);
    }
  }

  async login(payload: loginOptions) {
    try {
      const { email, password } = payload;
      const user = await this.userRepository.findByCredentials({
        email,
        password,
      });
      if (!user) {
        throw new NotFound("Wrong email/password combination");
      }
      if (user.softDeleted)
        throw new NotFound("Wrong email/password combination");

      const token = await user.generateAuthToken();

      logger.info("User successfully logged in...");
      return { user, token };
    } catch (e: any) {
      if (e instanceof NotFound) throw e;
      if (e instanceof Unauthorized) throw e;
      logger.error("Error logging user in...", e);
      throw new InternalServerError(`Error logging user in.`);
    }
  }

  async logout(req: any) {
    try {
      const user = await this.userRepository.findOne({ _id: req.user._id });
      if (!user) throw new NotFound("User not found");

      user.tokens = user.tokens.filter(
        (token: any) => token.token !== req.token
      );

      await user.save();
      logger.info("User successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging user out...");
      throw new InternalServerError(`Error logging user out`);
    }
  }

  async logoutFromAllDevices(req: any) {
    try {
      const user = await this.userRepository.findOne({
        _id: req.user._id,
      });
      if (!user) throw new NotFound("User not found");

      user.tokens = [];
      await user.save();
      logger.info("User successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging user out...");
      throw new InternalServerError(`Error user user out`);
    }
  }

  async updateUserInfo(id: ObjectId, payload: userUpdateFields) {
    try {
      const user = await this.userRepository.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) throw new NotFound(`User doesn't exist`);

      logger.info("User info updated...");
      return user;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error updating fields...`);
      throw new InternalServerError(`Error updating fields`);
    }
  }

  async updatePassword(id: ObjectId, password: string) {
    try {
      const user = await this.userRepository.findOneAndUpdate(
        { _id: id },
        { password },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) throw new NotFound(`User doesn't exist`);

      logger.info("User password updated...");
      return user;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error updating password...`);
      throw new InternalServerError(`Error updating password`);
    }
  }

  async deleteUser(id: ObjectId) {
    try {
      const user = await this.userRepository.findByIdAndUpdate(
        { _id: id },
        { softDeleted: true },
        { runValidators: true, new: true }
      );
      if (!user) throw new NotFound(`User doesn't exist`);
      user.tokens = [];
      user.save();

      logger.info("User successfully deleted");
      return user;
    } catch (e) {
      if (e instanceof NotFound) throw e;
      logger.error(`Error deleting user...`);
      throw new InternalServerError(`Error deleting user`);
    }
  }

  async uploadAvatar(id: ObjectId, file: Express.Multer.File) {
    try {
      const user = await this.getSpecificUser(id);

      let publicId;

      if (user.avatar) {
        const oldImage = user.avatar;
        publicId = oldImage.split("/").pop()?.split(".")[0] as string;
      }

      const newUrl = await this.upload(file, publicId);

      await user.updateOne(
        {
          avatar: newUrl,
        },
        { new: true, runValidators: true }
      );
      return { user, newUrl };
    } catch (e) {
      if (e instanceof NotFound) throw e;
      logger.error(`Error uploading user image`);
      throw new InternalServerError(`Error uploading user image`);
    }
  }

  private async upload(file: Express.Multer.File, oldImage?: string | null) {
    try {
      const { cloudinary } = uploadMiddleware();

      if (oldImage) {
        await cloudinary.uploader.destroy(oldImage);
      }
      const { path } = file;
      const result = await cloudinary.uploader.upload(path);

      return result.secure_url;
    } catch (e) {
      throw e;
    }
  }

  async getSpecificUser(id: ObjectId) {
    try {
      const user = await this.userRepository.findOne({ _id: id });
      if (!user) throw new NotFound("User does not exist");
      return user;
    } catch (e) {
      throw e;
    }
  }
  async createOTP() {
    return "";
  }

  async verifyOTP() {
    return true;
  }
}
