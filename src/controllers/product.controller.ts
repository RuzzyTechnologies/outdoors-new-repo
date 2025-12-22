import { Request, Response, NextFunction } from "express";

import { ProductController as PC, AuthenticatedRequest } from "../types";
import { ProductService } from "../services/product.service";
import { BadRequest } from "../utils/error";

export class ProductController implements PC {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @openapi
   * /api/v1/products:
   *   post:
   *     summary: Add a new product
   *     description: Create a new product (admin only)
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateProductRequest"
   *     responses:
   *       201:
   *         description: Product added successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ProductResponse"
   *       400:
   *         description: Missing or invalid fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async addProduct(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        title,
        category,
        availability,
        description,
        quantity,
        featured,
        size,
        address,
        area,
        state,
      } = req.body;

      if (
        !title ||
        !category ||
        !availability ||
        !description ||
        !size ||
        !address ||
        !area ||
        !state
      )
        throw new BadRequest(
          "Bad Request. Fields (title, category, availability, description, size, address, area, state) cannot be empty"
        );

      if (req.admin) {
        const product = await this.productService.createProduct(
          req.admin._id as string,
          {
            title,
            category,
            availability,
            description,
            quantity,
            featured,
            size,
            address,
          },
          { stateArea: area, stateName: state }
        );

        res.status(201).json({
          status: 201,
          message: "Product added successfully!",
          data: { product },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/products/{productId}/image:
   *   post:
   *     summary: Upload product image
   *     description: Upload an image for a specific product
   *     tags:
   *       - Product
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
   *         multipart/form-data:
   *           schema:
   *             $ref: "#/components/schemas/UploadProductImageRequest"
   *     responses:
   *       200:
   *         description: Upload successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UploadProductImageResponse"
   *       400:
   *         description: File not found or invalid upload
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      if (!req.file) throw new BadRequest("Bad Request. File not found");

      const { product, url } = await this.productService.uploadImage(
        productId as string,
        req.file as Express.Multer.File
      );

      res.status(200).json({
        status: 200,
        message: "Upload successful",
        data: {
          product,
          url,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/products/{productId}:
   *   get:
   *     summary: Get a product by ID
   *     description: Fetch a single product by its ID
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *         example: 64fa1b2c91c8a3e00123abcd
   *     responses:
   *       200:
   *         description: Product fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetSpecificProductResponse"
   *       400:
   *         description: Invalid product ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async getSpecificProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const product = await this.productService.getSpecificProduct(
        productId as string
      );

      res.status(200).json({
        status: 200,
        message: "Product fetched successfully",
        data: {
          product,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/products:
   *   get:
   *     summary: Get all products
   *     description: Fetch a paginated list of products
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 10
   *     responses:
   *       200:
   *         description: Products fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAllProductsResponse"
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const getProducts = await this.productService.getAllProducts(
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        status: 200,
        message: "Products fetched successfully",
        data: {
          currentPage: getProducts.page,
          totalPages: getProducts.totalPages,
          products: getProducts.products,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  /**
   * @openapi
   * /api/v1/products/{productId}:
   *   patch:
   *     summary: Update a product
   *     description: Update fields of a product by ID (admin only)
   *     tags:
   *       - Product
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
   *             $ref: "#/components/schemas/UpdateProductRequest"
   *     responses:
   *       200:
   *         description: Product successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetSpecificProductResponse"
   *       400:
   *         description: Invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. One of fields( title, category, availability, description, quantity, featured, size, address) cannot be empty"
        );
      const { productId } = req.params;
      const product = await this.productService.updateProduct(
        productId as string,
        req.body
      );

      res.status(200).json({
        status: 200,
        message: "Product sucessfully updated!",
        data: {
          product,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/products/by-area:
   *   get:
   *     summary: Get products in a specific area and state
   *     description: Fetch paginated products filtered by state and area
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: state
   *         required: true
   *         schema:
   *           type: string
   *         example: Lagos
   *       - in: query
   *         name: area
   *         required: true
   *         schema:
   *           type: string
   *         example: Ikeja
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 10
   *     responses:
   *       200:
   *         description: Products fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetProductsPaginatedResponse"
   *       400:
   *         description: Missing state or area
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async getProductsByArea(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const { state, area } = req.query;
      if (!state || !area)
        throw new BadRequest(
          "Bad Request. Field (state and area) cannot be empty."
        );

      const getProducts = await this.productService.getProductsByArea(
        area as string,
        state as string,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        status: 200,
        message: "Products fetched successfully!",
        data: {
          currentPage: getProducts.page,
          totalPages: getProducts.totalPages,
          products: getProducts.products,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/products/by-state:
   *   get:
   *     summary: Get products in a specific state
   *     description: Fetch paginated products filtered by state
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: state
   *         required: true
   *         schema:
   *           type: string
   *         example: Lagos
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 10
   *     responses:
   *       200:
   *         description: Products fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetProductsPaginatedResponse"
   *       400:
   *         description: Missing state
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async getProductsByState(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const { state } = req.query;
      if (!state)
        throw new BadRequest("Bad Request. Field (state) cannot be empty.");

      const getProducts = await this.productService.getProductsByState(
        state as string,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        status: 200,
        message: "Products fetched successfully!",
        data: {
          currentPage: getProducts.page,
          totalPages: getProducts.totalPages,
          products: getProducts.products,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @openapi
   * /api/v1/products/delete/{productId}:
   *   delete:
   *     summary: Delete a product by ID
   *     description: Remove a product from the system (admin only)
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *         example: 64fa1b2c91c8a3e00123abcd
   *     responses:
   *       200:
   *         description: Product successfully deleted
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/DeleteProductResponse"
   *       400:
   *         description: Invalid product ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       404:
   *         description: Product not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      await this.productService.deleteProduct(productId as string);

      res.status(200).json({
        status: 200,
        message: "Product successfully deleted!",
      });
    } catch (e) {
      next(e);
    }
  }
}
