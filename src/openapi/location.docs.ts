/**
 * @openapi
 * components:
 *   schemas:
 *     CreateStateRequest:
 *       type: object
 *       required:
 *         - state
 *       properties:
 *         state:
 *           type: string
 *           example: Lagos
 *
 *     CreateAreaRequest:
 *       type: object
 *       required:
 *         - area
 *         - state
 *       properties:
 *         area:
 *           type: string
 *           example: Ikeja
 *         state:
 *           type: string
 *           example: Lagos
 *
 *     Location:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64f1b2c91c8a3e00123abcd4
 *         state:
 *           type: string
 *           example: Lagos
 *         area:
 *           type: string
 *           example: Ikeja
 *
 *     LocationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: State created successfully
 *         data:
 *           type: object
 *           properties:
 *             state:
 *               $ref: "#/components/schemas/Location"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Bad Request. Field (state) cannot be empty
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 5
 *
 *     GetAllStatesResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: States fetched successfully!
 *         data:
 *           allOf:
 *             - $ref: "#/components/schemas/PaginationMeta"
 *             - type: object
 *               properties:
 *                 states:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Location"
 *
 *     GetAllAreasResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Areas in Lagos fetched successfully!
 *         data:
 *           allOf:
 *             - $ref: "#/components/schemas/PaginationMeta"
 *             - type: object
 *               properties:
 *                 areas:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Location"
 */
