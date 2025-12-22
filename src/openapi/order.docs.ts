/**
 * @openapi
 * components:
 *   schemas:
 *     CreateOrderRequest:
 *       type: object
 *       properties:
 *         dateRequested:
 *           type: string
 *           format: date-time
 *           example: 2025-12-25T12:00:00Z
 *         status:
 *           type: string
 *           example: pending
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64fa1b2c91c8a3e00123abcd
 *         userId:
 *           type: string
 *           example: 64fa1b2c91c8a3e00123abcd
 *         productId:
 *           type: string
 *           example: 64fa1b2c91c8a3e00123abcd
 *         dateRequested:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           example: pending
 *
 *     OrderResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: Order created successfully!
 *         data:
 *           type: object
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/Order"
 *
 *     GetOrdersPaginatedResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Orders fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Order"
 *
 *     CreateQuoteRequest:
 *       type: object
 *       required:
 *         - availableFrom
 *         - availableTo
 *         - price
 *         - title
 *       properties:
 *         availableFrom:
 *           type: string
 *           format: date-time
 *         availableTo:
 *           type: string
 *           format: date-time
 *         price:
 *           type: number
 *           example: 150.5
 *         title:
 *           type: string
 *           example: Special Offer
 *         description:
 *           type: string
 *           example: Quote description goes here
 *
 *     Quote:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         orderId:
 *           type: string
 *         availableFrom:
 *           type: string
 *           format: date-time
 *         availableTo:
 *           type: string
 *           format: date-time
 *         price:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *
 *     QuoteResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: Quote created successfully!
 *         data:
 *           type: object
 *           properties:
 *             quote:
 *               $ref: "#/components/schemas/Quote"
 */
