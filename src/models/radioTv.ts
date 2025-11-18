import mongoose from "mongoose";
const { Schema } = mongoose;

const radioTvSchema = new Schema(
  {
    location: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      trim: true,
      required: true,
    },
    preferredStation: {
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

export const radioTv = mongoose.model("radioTv", radioTvSchema);
