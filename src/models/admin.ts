import mongoose from "mongoose";
import { isEmail } from "validator";
import jwt from "jsonwebtoken";

import { hashPassword, verifyPassword } from "../utils/argon";
const { Schema } = mongoose;

import {
  ERR_EMAIL_EXISTS,
  ERR_EMAIL_REQUIRED,
  ERR_PWORD_REQUIRED,
  ERR_LASTNAME_REQUIRED,
  ERR_FIRSTNAME_REQUIRED,
  ERR_USERNAME_REQUIRED,
} from "../utils/reusables.js";
import { loginOptions } from "../types.js";
import { NotFound } from "../utils/error.js";
import type { AdminDocument, AdminModel } from "../types.js";

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
      type: String,
      required: [true, ERR_USERNAME_REQUIRED],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, ERR_EMAIL_REQUIRED],
      unique: [true, ERR_EMAIL_EXISTS],
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
          required: true,
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
  delete userObject.avatar;

  return userObject;
};

adminSchema.methods.generateAuthToken = async function () {
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
};

adminSchema.statics.findByCredentials = async (payload: loginOptions) => {
  const { email, loginPassword } = payload;
  const admin = await Admin.findOne({ email });

  if (!admin) throw new NotFound("Wrong email/password combination");

  const isMatch = verifyPassword(admin.password, loginPassword);
  if (!isMatch) throw new NotFound("Wrong email/password combination");

  return admin;
};

export const Admin = mongoose.model<AdminDocument, AdminModel>(
  "Admin",
  adminSchema
);
