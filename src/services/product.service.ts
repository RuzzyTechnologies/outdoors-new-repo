import { Product } from "../models/products";
import { NotFound, InternalServerError, BadRequest } from "../utils/error";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";
import { productPayload, ProductService as PS } from "../types";
import type { locationPayload, updateProductPayload } from "../types";
import { uploadMiddleware } from "../middleware/multer";
import { LocationService } from "./location.service";
import { Types } from "mongoose";

export class ProductService implements PS {
  private productRepository;
  private locationService;

  constructor() {
    this.productRepository = Product;
    this.locationService = new LocationService();
  }

  async createProduct(
    id: ObjectId,
    payload: productPayload,
    locationDetails: locationPayload
  ) {
    try {
      const { stateName, stateArea } = locationDetails;

      const area = await this.locationService.getArea(stateArea, stateName);

      const product = new this.productRepository({
        ...payload,
        createdBy: id,
        state: area.location,
        area: area._id,
      });
      await product.save();

      logger.info("Product created...");
      return product;
    } catch (e: any) {
      logger.error(`Error creating product.`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error creating product.`);
    }
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    try {
      const product = await this.getSpecificProduct(id);

      let publicId;

      if (product.image) {
        const oldImage = product.image.url;
        publicId = oldImage.split("/").pop()?.split(".")[0] as string;
      }

      const { fileName, size, mimetype, url } = await this.upload(
        file,
        publicId
      );

      await product.updateOne(
        {
          "image.url": url,
          "image.fileName": fileName,
          "image.size": size,
          "image.mimetype": mimetype,
        },
        { new: true, runValidators: true }
      );

      return { product, url };
    } catch (e) {
      logger.error(`Error uploading product image`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error uploading product image`);
    }
  }

  private async upload(file: Express.Multer.File, oldImage?: string | null) {
    try {
      const { cloudinary } = uploadMiddleware();

      if (oldImage) {
        await cloudinary.uploader.destroy(oldImage);
      }
      const { path } = file;
      const result = await cloudinary.uploader.upload(path);

      const fileName = result.original_filename;
      const size = result.bytes;
      const mimetype = result.resource_type + result.format;
      const url = result.secure_url;

      return { fileName, size, mimetype, url };
    } catch (e) {
      throw e;
    }
  }

  async getSpecificProduct(id: string) {
    try {
      if (!Types.ObjectId.isValid(id))
        throw new BadRequest("Invalid Product ID");

      const product = await this.productRepository.findOne({
        _id: id,
      });
      if (!product) throw new NotFound(`Product not found`);

      return product;
    } catch (e: any) {
      logger.error("Product fetch unsuccessful!");
      if (e instanceof NotFound || e instanceof BadRequest) throw e;
      throw new InternalServerError(`Product fetch unsuccessful!`);
    }
  }

  async getAllProducts(page: number = 1, limit: number = 10) {
    try {
      page = page || 1;
      limit = limit || 10;

      const skip = (page - 1) * limit;
      const total = await this.productRepository.countDocuments();

      const products = await this.productRepository
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      if (!products) throw new NotFound(`No product found`);
      return { products, totalPages: Math.ceil(total / limit), page };
    } catch (e: any) {
      logger.error("Error fetching products");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching products`);
    }
  }

  async updateProduct(id: string, payload: updateProductPayload) {
    try {
      const product = await this.productRepository.findOneAndUpdate(
        { _id: id },
        payload,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!product) throw new NotFound(`Product doesn't exist`);

      logger.info("Product updated successfully!");
      return product;
    } catch (e) {
      logger.error("Product updation unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product updation unsuccessful!`);
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.productRepository.findByIdAndDelete({
        _id: id,
      });
      if (!product) throw new NotFound(`Product doesn't exist`);

      logger.info("Product deleted successfully!");
      return product;
    } catch (e) {
      logger.error("Product deletion unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product deletion unsuccessful!`);
    }
  }

  async getProductsByState(
    state: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      page = page || 1;
      limit = limit || 10;

      const skip = (page - 1) * limit;

      const location = await this.locationService.getState(state);

      const total = await this.productRepository.countDocuments({
        state: location._id,
      });

      const products = await this.productRepository
        .find({ state: location._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      if (!products) throw new NotFound(`No product found!`);
      return { products, totalPages: Math.ceil(total / limit), page };
    } catch (e) {
      logger.error("Error fetching product!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching product!`);
    }
  }

  async getProductsByArea(
    areaName: string,
    stateName: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      page = page || 1;
      limit = limit || 10;

      const area = await this.locationService.getArea(areaName, stateName);

      const skip = (page - 1) * limit;

      const total = await this.productRepository.countDocuments({
        area: area._id,
        state: area.location,
      });
      const products = await this.productRepository
        .find({
          area: area._id,
          state: area.location,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (!products) throw new NotFound(`No product found!`);

      return { products, totalPages: Math.ceil(total / limit), page };
    } catch (e) {
      logger.error("Error fetching product!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching product!`);
    }
  }
}
