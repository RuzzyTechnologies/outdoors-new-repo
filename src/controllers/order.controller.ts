import { Request, Response, NextFunction } from "express";

import {
  OrderController as OC,
  AuthRequest,
  AuthenticatedRequest,
} from "../types";
import { OrderService } from "../services/order.service";
import { BadRequest } from "../utils/error";

export class OrderController implements OC {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let { productId } = req.params;
      let { dateRequested, status } = req.body;

      if (req.user) {
        const userId = req.user._id as string;

        const order = await this.orderService.createOrder({
          userId,
          productId,
          dateRequested,
          status,
        });

        res.status(201).json({
          status: 201,
          message: "Order created successfully!",
          data: {
            order,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async findSpecificOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const order = await this.orderService.findSpecificOrder(
        orderId as string
      );

      res.status(200).json({
        statsus: 200,
        message: "Order fetched successfully!",
        data: {
          order,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;

      const orders = await this.orderService.getAllOrders(
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        status: 200,
        message: "Orders fetched successfully",
        data: {
          currentPage: orders.page,
          totalPages: orders.totalPages,
          orders: orders.orders,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async createQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { availableFrom, availableTo, price, title, description } =
        req.body;

      if (!availableFrom || !availableTo || !price || !title)
        throw new BadRequest(
          "Bad Request. Fields (availableFrom, availableTo, price and title) cannot be empty"
        );

      const quote = await this.orderService.createQuote(orderId as string, {
        availableFrom,
        availableTo,
        price,
        title,
        description,
      });

      res.status(201).json({
        status: 201,
        message: "Quote created successfully! ",
        data: quote,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { quoteId } = req.params;

      if (Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. One of fields (title, price,,availableFrom, availableTo, description cannot be empty"
        );
      const { availableFrom, availableTo, price, title, description } =
        req.body;

      const quote = await this.orderService.updateQuote(quoteId as string, {
        availableFrom,
        availableTo,
        price,
        title,
        description,
      });

      res.status(200).json({
        status: 200,
        message: "Quote updated successfully!",
        data: { quote },
      });
    } catch (e) {
      next(e);
    }
  }

  async findSpecificQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { quoteId } = req.params;

      const order = await this.orderService.findSpecificQuote(
        quoteId as string
      );

      res.status(200).json({
        status: 200,
        message: "Order fetched successfully!",
        data: {
          order,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
