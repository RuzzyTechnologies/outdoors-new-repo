import mongoose from "mongoose";
const { Schema } = mongoose;

const areaSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const stateSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    totalAreas: {
      type: Number,
      trim: true,
      default: 0,
    },
    area: {
      type: areaSchema,
      default: () => ({}),
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

export const State = mongoose.model("State", stateSchema);
