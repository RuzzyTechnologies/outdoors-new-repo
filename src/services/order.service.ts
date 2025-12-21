import { Order, Quote } from "../models/order";
import { OrderService as OS } from "../types";
import type { orderPayload, quotePayload, updateQuotePayload } from "../types";
import { InternalServerError, NotFound } from "../utils/error";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";
import { dateParser, randomString, stringParser } from "../utils";
import { UserService } from "./user.service";
import { ProductService } from "./product.service";

export class OrderService implements OS {
  private orderRepository;
  private quoteRepository;
  private userService;
  private productService;

  constructor() {
    this.orderRepository = Order;
    this.quoteRepository = Quote;
    this.userService = new UserService();
    this.productService = new ProductService();
  }

  async createOrder(order: orderPayload) {
    try {
      const { userId, productId, dateRequested, status } = order;

      const user = await this.userService.getSpecificUser(userId);
      const product = await this.productService.getSpecificProduct(productId);

      const invoice = this.createInvoiceString();

      const newOrder = new this.orderRepository({
        user: user.fullName,
        userDetails: this.parseStringArray([user.email, user.phoneNo]),
        product: product.title,
        invoice,
        dateRequested: this.parseDate(dateRequested),
        status,
      });
      await newOrder.save();
      return newOrder;
    } catch (e: any) {
      logger.error("Error creating order");
      throw new InternalServerError("Error creating order");
    }
  }

  async findSpecificOrder(orderId: string) {
    try {
      const _id = new ObjectId(orderId);
      const order = await this.orderRepository.findOne({ _id });

      if (!order) throw new NotFound("Order doesn't exist");

      return order;
    } catch (e: any) {
      logger.error("Error finding order");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError("Error finding order");
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const total = await this.orderRepository.countDocuments();
      const orders = await this.orderRepository
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      if (!orders) throw new NotFound("No order found");
      return { orders, totalPages: Math.ceil(total / limit), page };
    } catch (e: any) {
      logger.error("Error fetching orders");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError("Error fetching orders");
    }
  }

  /** QUOTE */
  async createQuote(orderId: string, quotePayload: quotePayload) {
    try {
      const order = await this.findSpecificOrder(orderId);
      const { availableFrom, availableTo, price, title, description } =
        quotePayload;

      const quote = new this.quoteRepository({
        title,
        price,
        description,
        availableFrom: this.parseDate(availableFrom),
        availableTo: this.parseDate(availableTo),
        invoice: order.invoice,
        orderId: order._id,
      });

      await quote.save();
      return quote;
    } catch (e: any) {
      logger.error("Error creating error");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError("Error creating user");
    }
  }

  async findSpecificQuote(quoteId: string) {
    try {
      const _id = new ObjectId(quoteId);
      const quote = await this.quoteRepository.findOne({ _id });

      if (!quote) throw new NotFound("Quote doesn't exist");

      return quote;
    } catch (e: any) {
      logger.error("Error finding quote");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError("Error finding quote");
    }
  }

  async updateQuote(quoteId: string, quotePayload: updateQuotePayload) {
    try {
      const _id = new ObjectId(quoteId);
      const quote = await this.quoteRepository.findByIdAndUpdate(
        _id,
        quotePayload,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!quote) throw new NotFound("Quote doesnt exist");
      return quote;
    } catch (e: any) {
      logger.error("Error updating quote");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError("Error updating quote");
    }
  }

  private createInvoiceString() {
    try {
      return randomString(16);
    } catch (e: any) {
      logger.error("Error creating invoice.");
      throw new InternalServerError("Error creating invoice.");
    }
  }

  private parseDate(date: string) {
    try {
      return dateParser(date);
    } catch (e: any) {
      logger.error("Error parsing date string.");
      throw new InternalServerError("Error parsing date string.");
    }
  }

  private parseStringArray(args: any[]) {
    try {
      return stringParser(args);
    } catch (e: any) {
      logger.error("Error parsing string array.");
      throw new InternalServerError("Error parsing string array.");
    }
  }

  async sendQuote(orderId: string, email: string) {}
}
