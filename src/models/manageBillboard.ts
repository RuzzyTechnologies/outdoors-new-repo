import mongoose from "mongoose";
const { Schema } = mongoose;

export const documentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
  },
  size: {
    type: Number,
  },
  uploadedAt: {
    type: Date,
    default: Date.now(),
  },
});

const manageBillboards = new Schema(
  {
    campaignName: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    expirationDate: {
      type: Date,
      trim: true,
    },
    frequencyOfReminder: {
      type: Number,
      trim: true,
    },
    document: {
      type: documentSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Billboards = mongoose.model("manageBillboards", manageBillboards);
