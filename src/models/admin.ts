import mongoose from "mongoose";
import { isEmail } from "validator";

const { Schema } = mongoose;

import {
  ERR_EMAIL_EXISTS,
  ERR_EMAIL_REQUIRED,
  ERR_PWORD_REQUIRED,
  ERR_LASTNAME_REQUIRED,
  ERR_FIRSTNAME_REQUIRED,
  ERR_USERNAME_REQUIRED,
} from "../utils/reusables.js";

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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Admin = mongoose.model("Admin", adminSchema);
