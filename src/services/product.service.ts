import { Product } from "../models/products";
import { NotFound, InternalServerError } from "../utils/error";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";
import { productPayload, ProductService as PS } from "../types";
import type { locationPayload, ProductDocument } from "../types";
import { uploadMiddleware } from "../middleware/multer";
import { LocationService } from "./location.service";

export class ProductService implements PS {
  private productRepository;
  private locationService;

  constructor() {
    this.productRepository = Product;
    this.locationService = new LocationService();
  }

  async createProduct(
    id: string,
    payload: productPayload,
    locationDetails: locationPayload
  ) {
    try {
      const { stateName, stateArea } = locationDetails;

      const state = await this.locationService.getState(stateName);
      const area = await this.locationService.getArea(stateArea);

      const _id = new ObjectId(id);

      const product = new this.productRepository({
        ...payload,
        owner: _id,
        state: state._id,
        area: area._id,
      });
      await product.save();
      logger.info("Product created...");
      return product;
    } catch (e: any) {
      logger.error(`Error creating product...${e}`);
      throw new InternalServerError(`Error creating product...${e}`);
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

      product.image.url = url;
      product.image.name = fileName;
      product.image.size = size;
      product.image.mimetype = mimetype;
      await product.save();

      return { product, url };
    } catch (e) {
      logger.error(`Error uploading product image:  ${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error uploading product image: ${e}`);
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
      const _id = new ObjectId(id);
      const product = (await this.productRepository.findOne({
        _id,
      })) as ProductDocument;
      if (!product) throw new NotFound(`Product not found`);

      return product;
    } catch (e: any) {
      logger.error("Product fetch unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product fetch unsuccessful!, ${e}`);
    }
  }

  async getAllProducts(page: number = 1, limit: number = 10) {
    try {
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
      throw new InternalServerError(`Error fetching products, ${e}`);
    }
  }

  async updateProduct(id: string, payload: productPayload) {
    try {
      const _id = new ObjectId(String(id));
      const product = await this.productRepository.findOneAndUpdate(
        _id,
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
      throw new InternalServerError(`Product updation unsuccessful!, ${e}`);
    }
  }

  async deleteProduct(id: string) {
    try {
      const _id = new ObjectId(String(id));
      const product = await this.productRepository.findByIdAndDelete(_id);
      if (!product) throw new NotFound(`Product doesn't exist`);

      logger.info("Product deleted successfully!");
      return product;
    } catch (e) {
      logger.error("Product deletion unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product deletion unsuccessful!, ${e}`);
    }
  }

  async getProductsByState(
    state: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
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
      throw new InternalServerError(`Error fetching product!, ${e}`);
    }
  }

  async getProductsByArea(
    areaName: string,
    stateName: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const area = await this.locationService.getArea(areaName);
      const state = await this.locationService.getState(stateName);

      const skip = (page - 1) * limit;

      const total = await this.productRepository.countDocuments({
        area: area._id,
        state: state._id,
      });
      const products = await this.productRepository
        .find({
          area: area._id,
          state: state._id,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (!products) throw new NotFound(`No product found!`);

      return { products, totalPages: Math.ceil(total / limit), page };
    } catch (e) {
      logger.error("Error fetching product!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching product!, ${e}`);
    }
  }
}
