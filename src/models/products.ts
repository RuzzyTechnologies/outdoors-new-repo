import mongoose from "mongoose";
const { Schema } = mongoose;

import { documentSchema } from "./manageBillboard.js";
import {
  ERR_DESCRIPTION_REQUIRED,
  PRODUCT_CATEGORY,
} from "../utils/reusables.js";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: PRODUCT_CATEGORY,
      required: true,
      trim: true,
    },
    availability: {
      type: Boolean,
      required: true,
      default: false,
    },
    description: {
      type: String,
      required: [true, ERR_DESCRIPTION_REQUIRED],
      trim: true,
    },
    size: {
      type: String,
      trim: true,
      required: true,
    },
    localtion: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: documentSchema,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Product = mongoose.model("Product", productSchema);
