import mongoose from "mongoose";
const { Schema } = mongoose;

import { documentSchema } from "./manageBillboard.js";

const printingSchema = new Schema(
  {
    subject: {
      type: String,
      trim: true,
    },
    request: {
      type: String,
      trim: true,
    },
    document: documentSchema,
    default: () => ({}),
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Printing = mongoose.model("Printing", printingSchema);
