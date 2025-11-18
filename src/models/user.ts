import mongoose from "mongoose";
import { isEmail } from "validator";
import { phone } from "phone";

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
    phone_no: {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const User = mongoose.model("User", userSchema);
