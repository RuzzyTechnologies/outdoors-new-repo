/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - availability
 *         - description
 *         - size
 *         - address
 *         - area
 *         - state
 *       properties:
 *         title:
 *           type: string
 *           example: Wooden Dining Table
 *         category:
 *           type: string
 *           example: Furniture
 *         availability:
 *           type: string
 *           example: in_stock
 *         description:
 *           type: string
 *           example: Solid oak dining table, seats six
 *         quantity:
 *           type: integer
 *           example: 10
 *         featured:
 *           type: boolean
 *           example: true
 *         size:
 *           type: string
 *           example: Large
 *         address:
 *           type: string
 *           example: 12 Allen Avenue
 *         area:
 *           type: string
 *           example: Ikeja
 *         state:
 *           type: string
 *           example: Lagos
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64fa1b2c91c8a3e00123abcd
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         availability:
 *           type: string
 *         description:
 *           type: string
 *         quantity:
 *           type: integer
 *         featured:
 *           type: boolean
 *         size:
 *           type: string
 *         address:
 *           type: string
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: Product added successfully!
 *         data:
 *           type: object
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/Product"
 *
 *     UploadProductImageRequest:
 *       type: object
 *       required:
 *         - image
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *
 *     UploadProductImageResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Upload successful
 *         data:
 *           type: object
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/Product"
 *             url:
 *               type: string
 *               format: uri
 *               example: https://cdn.example.com/products/img123.png
 *
 *     GetAllProductsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Products fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *
 *     GetSpecificProductResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Product fetched successfully
 *         data:
 *           type: object
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/Product"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Wooden Dining Table
 *         category:
 *           type: string
 *           example: Furniture
 *         availability:
 *           type: string
 *           example: in_stock
 *         description:
 *           type: string
 *           example: Solid oak dining table, seats six
 *         quantity:
 *           type: integer
 *           example: 10
 *         featured:
 *           type: boolean
 *           example: true
 *         size:
 *           type: string
 *           example: Large
 *         address:
 *           type: string
 *           example: 12 Allen Avenue
 *
 *     DeleteProductResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Product successfully deleted!
 *
 *     GetProductsPaginatedResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Products fetched successfully!
 *         data:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
