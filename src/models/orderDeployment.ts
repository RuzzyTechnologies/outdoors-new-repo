import mongoose from "mongoose";
const { Schema } = mongoose;

const deploymentSchema = new Schema(
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

export const Deployment = mongoose.model("Deployment", deploymentSchema);
