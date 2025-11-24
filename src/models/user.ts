import mongoose from "mongoose";
import { isEmail } from "validator";
import { phone } from "phone";
import jwt from "jsonwebtoken";
import verifyPassword, { hashPassword } from "../utils/argon";
import type { loginOptions } from "../types";
import { NotFound } from "../utils/error.js";

const { Schema } = mongoose;
const isValid = phone;

import {
  ERR_COMPANY_REQUIRED,
  ERR_EMAIL_EXISTS,
  ERR_EMAIL_REQUIRED,
  ERR_FULLNAME_REQUIRED,
  ERR_PHONE_REQUIRED,
  ERR_PWORD_REQUIRED,
} from "../utils/reusables.js";
import { UserDocument, UserModel } from "../types";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, ERR_FULLNAME_REQUIRED],
      trim: true,
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
    phoneNo: {
      type: Number,
      required: [true, ERR_PHONE_REQUIRED],
      trim: true,
      validator(value: string) {
        return isValid(value);
      },
    },
    password: {
      type: String,
      required: [true, ERR_PWORD_REQUIRED],
    },
    companyName: {
      type: String,
      trim: true,
      required: [true, ERR_COMPANY_REQUIRED],
    },
    positionAtTheCompany: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString(), username: this.email },
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

userSchema.statics.findByCredentials = async (payload: loginOptions) => {
  try {
    const { email, loginPassword } = payload;
    const user = await User.findOne({ email });

    if (!user) throw new NotFound("Wrong email/password combination");

    const isMatch = verifyPassword(user.password, loginPassword);
    if (!isMatch) throw new NotFound("Wrong email/password combination");

    return user;
  } catch (e) {
    throw e;
  }
};

export const User = mongoose.model<UserDocument, UserModel>("User", userSchema);
