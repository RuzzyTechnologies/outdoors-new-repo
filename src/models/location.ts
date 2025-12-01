import mongoose from "mongoose";
import {
  AreaDocument,
  AreaModel,
  LocationDocument,
  LocationModel,
} from "../types";
const { Schema } = mongoose;

const areaSchema = new Schema(
  {
    stateArea: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Area = mongoose.model<AreaDocument, AreaModel>("Area", areaSchema);

const stateSchema = new Schema(
  {
    stateName: {
      type: String,
      trim: true,
      required: true,
    },
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
