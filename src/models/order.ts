import mongoose from "mongoose";
const { Schema } = mongoose;

import {
  OrderDocument,
  OrderModel,
  QuoteDocument,
  QuoteModel,
} from "../types.js";
import { ORDER_STATUS } from "../utils/reusables.js";

const quoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    availableTo: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    invoice: {
      type: String,
      required: true,
      trim: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Quote = mongoose.model<QuoteDocument, QuoteModel>(
  "Quote",
  quoteSchema
);

const orderSchema = new Schema(
  {
    user: {
      type: String,
      trim: true,
      required: true,
    },
    userDetails: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    invoice: {
      type: String,
      required: true,
      trim: true,
    },
    dateRequested: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      required: true,
      trim: true,
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Order = mongoose.model<OrderDocument, OrderModel>(
  "Order",
  orderSchema
);
