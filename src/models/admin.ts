import mongoose from "mongoose";
import { isEmail } from "validator";
import jwt from "jsonwebtoken";
import verifyPassword, { hashPassword } from "../utils/argon";
import {
  ERR_EMAIL_EXISTS,
  ERR_EMAIL_REQUIRED,
  ERR_PWORD_REQUIRED,
  ERR_LASTNAME_REQUIRED,
  ERR_FIRSTNAME_REQUIRED,
  ERR_USERNAME_REQUIRED,
} from "../utils/reusables";
import { NotFound } from "../utils/error";
import type { loginOptions, AdminDocument, AdminModel } from "../types";

const { Schema } = mongoose;
const adminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, ERR_FIRSTNAME_REQUIRED],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, ERR_LASTNAME_REQUIRED],
      trim: true,
    },
    username: {
      unique: true,
      type: String,
      required: [true, ERR_USERNAME_REQUIRED],
      trim: true,
    },
    email: {
      unique: [true, ERR_EMAIL_EXISTS],
      type: String,
      required: [true, ERR_EMAIL_REQUIRED],
      trim: true,
      validate(value: string) {
        return isEmail(value);
      },
    },
    password: {
      type: String,
      required: [true, ERR_PWORD_REQUIRED],
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

adminSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

adminSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString(), username: this.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as any,
      }
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (e) {
    throw e;
  }
};

adminSchema.statics.findByCredentials = async (payload: loginOptions) => {
  try {
    const { email, password } = payload;
    const admin = await Admin.findOne({ email });

    if (!admin) throw new NotFound("Wrong email/password combination");

    const isMatch = await verifyPassword(admin.password, password);
    if (!isMatch) throw new NotFound("Wrong email/password combination");

    return admin;
  } catch (e) {
    throw e;
  }
};

export const Admin = mongoose.model<AdminDocument, AdminModel>(
  "Admin",
  adminSchema
);
