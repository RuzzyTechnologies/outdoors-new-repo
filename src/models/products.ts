import mongoose from "mongoose";
const { Schema } = mongoose;

import { documentSchema } from "./manageBillboard";
import { ERR_DESCRIPTION_REQUIRED, PRODUCT_CATEGORY } from "../utils/reusables";
import { ProductDocument, ProductModel } from "../types";

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
      default: true,
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
    state: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    area: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    address: {
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
    quantity: {
      type: Number,
      trim: true,
      default: 1,
    },
    createdBy: {
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

export const Product = mongoose.model<ProductDocument, ProductModel>(
  "Product",
  productSchema
);
