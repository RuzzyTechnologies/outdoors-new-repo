import mongoose from "mongoose";
const { Schema } = mongoose;

const installationSchema = new Schema(
  {
    subject: {
      type: String,
      trim: true,
    },
    request: {
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

export const Installation = mongoose.model("Installation", installationSchema);
