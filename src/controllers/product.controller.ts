import { Response, NextFunction } from "express";

import { ProductController as PC, AuthenticatedRequest } from "../types";
import { ProductService } from "../services/product.service";
import { BadRequest } from "../utils/error";

export class ProductController implements PC {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

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
          "Bad Request. Fields (title, category, availability, description,size, address, area, state ) cannot be empty"
        );

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
    } catch (e) {
      next(e);
    }
  }
  async uploadImage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId } = req.query;

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

  async getAllProducts(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
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
  async updateProduct(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. One of fields( title, category, availability, description, quantity, featured, size, address) cannot be empty"
        );
      const { productId } = req.query;
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
  async getProductsByArea(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit } = req.query;
      const { state, area } = req.body;
      if (!state || !area)
        throw new BadRequest(
          "Bad Request. Field (state and area) cannot be empty."
        );

      const getProducts = await this.productService.getProductsByArea(
        area,
        state,
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
  async getProductsByState(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit } = req.query;
      const { state } = req.body;
      if (!state)
        throw new BadRequest("Bad Request. Field (state) cannot be empty.");

      const getProducts = await this.productService.getProductsByState(
        state,
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
  async deleteProduct(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { productId } = req.query;
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
