import { Product } from "../models/products";
import { State } from "../models/location";
import { NotFound, InternalServerError } from "../utils/error";
import { logger } from "../utils/logger";
import { ObjectId } from "mongodb";
import { productPayload, ProductService as PS } from "../types";
import type {
  image,
  LocationDocument,
  locationPayload,
  ProductDocument,
} from "../types";
import { uploadMiddleware } from "../middleware/multer";

export class ProductService implements PS {
  private productRepository;
  private locationRepository;

  constructor() {
    this.productRepository = Product;
    this.locationRepository = State;
  }

  async createProduct(
    id: string,
    payload: productPayload,
    locationDetails: locationPayload,
    img?: image
  ) {
    try {
      const {
        title,
        category,
        size,
        quantity,
        availability,
        description,
        featured,
        address,
      } = payload;

      const _id = new ObjectId(id);
      const locale = await this.createLocation(locationDetails);
      const product = new this.productRepository({
        title,
        category,
        availability,
        description,
        quantity,
        featured,
        size,
        owner: _id,
        location: locale._id,
        address,
        image: img,
      });
      await product.save();
      logger.info("Product created...");
      return product;
    } catch (e: any) {
      logger.error(`Error creating product...${e}`);
      throw new InternalServerError(`Eror creating product...${e}`);
    }
  }

  async createLocation(location: locationPayload) {
    try {
      let state;

      const { stateName, stateArea } = location;

      state = await this.locationRepository.findOne({
        stateName,
      });
      if (!state) {
        state = new this.locationRepository({
          stateName,
        });
        await state.save();
      }

      const area = await this.locationRepository.findOne({
        stateName,
        "area.stateArea": stateArea,
      });

      if (!area) {
        const updateOps: any = {};

        updateOps.$inc = { totalAreas: 1 };
        updateOps.$addToSet = { "area.stateArea": stateArea };

        const locale = await this.locationRepository.findOneAndUpdate(
          {
            stateName,
          },
          updateOps,
          { new: true, runValidators: true }
        );
        return locale as LocationDocument;
      }
      return area as LocationDocument;
    } catch (e: any) {
      logger.error(`Error creating location...${e}`);
      throw new InternalServerError(`Eror creating location...${e}`);
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
      logger.error(`Error uploading product image: , ${e}`);
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

  async getAllProducts(pages: number, limit: number) {
    try {
      const page = pages || 1;
      const lim = limit || 10;

      const skip = (page - 1) * lim;
      const total = await this.productRepository.countDocuments();

      const products = await this.productRepository
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim);

      if (!products) throw new NotFound(`Product not found`);
      return { products, total, page };
    } catch (e: any) {
      logger.error("Product fetch unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product fetch unsuccessful!, ${e}`);
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

  async getProductByState(id: string, locationId: string) {
    try {
    } catch (e) {
      logger.error("Product updation unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product updation unsuccessful!, ${e}`);
    }
  }

  async getProductByArea(id: string, locationId: string) {
    try {
    } catch (e) {
      logger.error("Product updation unsuccessful!");
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Product updation unsuccessful!, ${e}`);
    }
  }
}
