import mongoose from "mongoose";
import { LocationDocument, LocationModel } from "../types";
const { Schema } = mongoose;

const areaSchema = new Schema(
  {
    stateArea: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const stateSchema = new Schema(
  {
    stateName: {
      type: String,
      trim: true,
      required: true,
    },
    totalAreas: {
      type: Number,
      trim: true,
      default: 0,
    },
    area: [
      {
        type: areaSchema,
        default: () => ({}),
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const State = mongoose.model<LocationDocument, LocationModel>(
  "State",
  stateSchema
);
