import { User } from "../models/user";
import { Conflict, InternalServerError, NotFound } from "../utils/error";
import type { loginOptions, userOptions, userUpdateFields } from "../types";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";
import { uploadMiddleware } from "../middleware/multer";

export class UserService implements UserService {
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
        password,
        companyName,
        position,
      });
      await user.save();
    } catch (e: any) {
      if (e instanceof Conflict) throw e;
      logger.error("Error creating user");
      throw new InternalServerError(`Error creating user, ${e}`);
    }
  }

  async login(payload: loginOptions) {
    try {
      const { email, loginPassword } = payload;
      const user = await this.userRepository.findByCredentials({
        email,
        loginPassword,
      });
      const token = await user.generateAuthToken();

      logger.info("User successfully logged in...");
      return { user, token };
    } catch (e: any) {
      if (e instanceof NotFound) throw e;
      logger.error("Error logging user in...", e);
      throw new InternalServerError(`Error logging user in... ${e}`);
    }
  }

  async logout(req: any) {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token: any) => token.token !== req.token
      );

      await req.user.save();
      logger.info("User successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging user out...");
      throw new InternalServerError(`Error logging user out...${e}`);
    }
  }

  async logoutFromAllDevices(req: any) {
    try {
      req.user.tokens = [];

      await req.user.save();
      logger.info("User successfully logged out...");
    } catch (e: any) {
      logger.error("Error logging user out...");
      throw new InternalServerError(`Error user user out...${e}`);
    }
  }

  async updateUserInfo(id: string, payload: userUpdateFields) {
    try {
      const _id = new ObjectId(String(id));
      const user = await this.userRepository.findOneAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
      });
      if (!user) throw new NotFound(`User doesn't exist`);

      logger.info("User info updated...");
      return user;
    } catch (e) {
      if (e instanceof NotFound) throw e;

      logger.error(`Error updating fields...`);
      throw new InternalServerError(`Error updating fields...${e}`);
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      const _id = new ObjectId(String(id));
      const user = await this.userRepository.findOneAndUpdate(
        _id,
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
      throw new InternalServerError(`Error updating password...${e}`);
    }
  }

  async deleteUser(id: string) {
    try {
      const _id = new ObjectId(id);
      const user = await this.userRepository.findByIdAndDelete(_id);
      if (!user) throw new NotFound(`User doesn't exist`);

      logger.info("User successfully deleted");
      return user;
    } catch (e) {
      if (e instanceof NotFound) throw e;
      logger.error(`Error deleting user...`);
      throw new InternalServerError(`Error deleting user...${e}`);
    }
  }

  async uploadAvatar(id: string, file: Express.Multer.File) {
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
      logger.error(`Error uploading user image: , ${e}`);
      throw e;
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

  async getSpecificUser(id: string) {
    try {
      const _id = new ObjectId(id);
      const user = await this.userRepository.findOne({ _id });
      if (!user) throw new NotFound("User does not exist");
      return user;
    } catch (e) {
      throw e;
    }
  }
}
