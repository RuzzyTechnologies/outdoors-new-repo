import { Request, Response, NextFunction } from "express";

import { OrderController as OC, AuthRequest } from "../types";
import { OrderService } from "../services/order.service";
import { BadRequest } from "../utils/error";
import { ObjectId } from "mongodb";

export class OrderController implements OC {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  /**
   * @openapi
   * /api/v1/orders/{productId}:
   *   post:
   *     summary: Create an order
   *     description: Place a new order for a specific product (user only)
   *     tags:
   *       - Order
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *         example: 64fa1b2c91c8a3e00123abcd
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateOrderRequest"
   *     responses:
   *       201:
   *         description: Order created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/OrderResponse"
   *       400:
   *         description: Invalid request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal server error
   */

  createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let { productId } = req.params;

      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. Fields (dateRequested, status) cannot be empty"
        );

      let { dateRequested, status } = req.body;

      if (!dateRequested || !status)
        throw new BadRequest(
          "Bad Request. Fields (dateRequested, status) cannot be empty"
        );

      if (req.user) {
        const userId = req.user._id as ObjectId;

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
  };

  /**
   * @openapi
   * /api/v1/orders/{orderId}:
   *   get:
   *     summary: Get a specific order
   *     description: Fetch an order by ID
   *     tags:
   *       - Order
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         example: 64fa1b2c91c8a3e00123abcd
   *     responses:
   *       200:
   *         description: Order fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/OrderResponse"
   *       404:
   *         description: Order not found
   *       500:
   *         description: Internal server error
   */

  findSpecificOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
  };

  /**
   * @openapi
   * /api/v1/orders:
   *   get:
   *     summary: Get all orders
   *     description: Fetch paginated orders
   *     tags:
   *       - Order
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           example: 10
   *     responses:
   *       200:
   *         description: Orders fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetOrdersPaginatedResponse"
   *       500:
   *         description: Internal server error
   */

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  /**
   * @openapi
   * /api/v1/quotes/{orderId}:
   *   post:
   *     summary: Create a quote for an order
   *     description: Add a quote for a specific order
   *     tags:
   *       - Quote
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         example: 64fa1b2c91c8a3e00123abcd
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateQuoteRequest"
   *     responses:
   *       201:
   *         description: Quote created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/QuoteResponse"
   *       400:
   *         description: Missing required fields
   *       500:
   *         description: Internal server error
   */

  createQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body)
        throw new BadRequest(
          "Bad Request. Fields (availableFrom, availableTo, price and title) cannot be empty"
        );

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
  };

  /**
   * @openapi
   * /api/v1/quotes/{quoteId}:
   *   patch:
   *     summary: Update a quote
   *     description: Update fields of a quote
   *     tags:
   *       - Quote
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: quoteId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateQuoteRequest"
   *     responses:
   *       200:
   *         description: Quote updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/QuoteResponse"
   *       400:
   *         description: Invalid request body
   *       500:
   *         description: Internal server error
   */

  updateQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { quoteId } = req.params;
      const updates = Object.keys(req.body);

      if (updates.length === 0)
        throw new BadRequest(
          "Bad Request. One of fields (title, price, availableFrom, availableTo, description) cannot be empty"
        );

      const validOptions = [
        "title",
        "price",
        "availableFrom",
        "availableTo",
        "description",
      ];

      const validUpdates = updates.every((update) =>
        validOptions.includes(update)
      );

      if (!validUpdates)
        throw new BadRequest(
          "Bad Request. Only fields (title, price, availableFrom, availableTo, description) are allowed"
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
  };

  /**
   * @openapi
   * /api/v1/quotes/{quoteId}:
   *   get:
   *     summary: Get a specific quote
   *     description: Fetch a quote by ID
   *     tags:
   *       - Quote
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: quoteId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Quote fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/QuoteResponse"
   *       404:
   *         description: Quote not found
   *       500:
   *         description: Internal server error
   */

  findSpecificQuote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
  };
}
