import { Document, Model } from "mongoose";
import { ObjectId } from "mongodb";

/** ADMIN */

export interface AdminService {
  createAdmin: (payload: adminOptions) => Promise<AdminDocument>;
  login: (payload: loginOptions) => Promise<tokenizedAdmin>;
  logout: (payload: any) => Promise<void>;
  updateAdminInfo: (
    id: string,
    paylaod: adminUpdateFields
  ) => Promise<AdminDocument>;
  updatePassword: (id: string, password: string) => Promise<AdminDocument>;
  deleteAdmin: (id: string) => Promise<AdminDocument>;
  createOTP: () => Promise<string>;
  verifyOTP: () => Promise<boolean>;
}

export type adminOptions = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};
export type loginOptions = {
  email: string;
  loginPassword: string;
};

type tokenizedAdmin = {
  admin: AdminDocument;
  token: string;
};

export interface AdminDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  tokens: string[];
  createdAt: Date;
  updatedAt: Date;

  toJSON(): Record<string, any>;
  generateAuthToken(): Promise<string>;
}

export interface AdminModel extends Model<AdminDocument> {
  findByCredentials(payload: loginOptions): Promise<AdminDocument>;
}

export type adminUpdateFields = {
  firstName?: string;
  lastName?: string;
  username?: string;
};

/** USER */
export type userOptions = {
  fullName: string;
  email: string;
  phoneNo: number;
  password: string;
  companyName: string;
  position: string;
};

type tokenizedUser = {
  user: UserDocument;
  token: string;
};

type avatarUser = {
  user: UserDocument;
  newUrl: string;
};

export type userUpdateFields = {
  fullname?: string;
  phoneNo?: number;
  companyName?: string;
  position?: string;
};

export interface UserService {
  createUser: (payload: userOptions) => Promise<UserDocument>;
  login: (payload: loginOptions) => Promise<tokenizedUser>;
  logout: (payload: any) => Promise<void>;
  logoutFromAllDevices: (payload: any) => Promise<void>;
  updateUserInfo: (
    id: string,
    paylaod: userUpdateFields
  ) => Promise<UserDocument>;
  updatePassword: (id: string, password: string) => Promise<UserDocument>;
  deleteUser: (id: string) => Promise<UserDocument>;
  getSpecificUser: (id: string) => Promise<UserDocument>;
  uploadAvatar: (id: string, file: Express.Multer.File) => Promise<avatarUser>;
  createOTP: () => Promise<string>;
  verifyOTP: () => Promise<boolean>;
}

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  phoneNo: number;
  companyName: string;
  position: string;
  password: string;
  avatar: string;
  tokens: string[];
  createdAt: Date;
  updatedAt: Date;

  toJSON(): Record<string, any>;
  generateAuthToken(): Promise<string>;
}

export interface UserModel extends Model<UserDocument> {
  findByCredentials(payload: loginOptions): Promise<UserDocument>;
}

export interface CustomParams {
  folder: string;
  allowedFormats: string[];
}

/** PRODUCT */

export type image = {
  name: string;
  url: string;
  uploadedAt: Date;
  mimetype: string;
  size: number;
};

export type productPayload = {
  title: string;
  category: string;
  availability: boolean;
  description: string;
  quantity: string;
  featured: boolean;
  size: string;
  address: string;
};

export interface ProductDocument extends Document {
  title: string;
  category: Category;
  availability: boolean;
  description: string;
  size: string;
  state: ObjectId;
  area: ObjectId;
  address: string;
  image: image;
  featured: boolean;
  quantity: string;
  owner: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductModel extends Model<ProductDocument> {}

export interface ProductService {
  createProduct(
    id: string,
    payload: productPayload,
    location: locationPayload,
    img?: image
  ): Promise<ProductDocument>;
  uploadImage(
    id: string,
    file: Express.Multer.File
  ): Promise<{
    product: ProductDocument;
    url: string;
  }>;
  getSpecificProduct(id: string): Promise<ProductDocument>;
  getAllProducts(
    pages: number,
    limit: number
  ): Promise<{
    products: ProductDocument[];
    totalPages: number;
    page: number;
  }>;
  updateProduct(id: string, payload: productPayload): Promise<ProductDocument>;
  deleteProduct(id: string): Promise<ProductDocument>;
  getProductsByState(
    state: string,
    page: number,
    limit: number
  ): Promise<{ products: ProductDocument[]; totalPages: number; page: number }>;
  getProductsByArea(
    areaName: string,
    stateName: string
  ): Promise<{ products: ProductDocument[]; totalPages: number; page: number }>;
}

type Category =
  | "All"
  | "Unipole"
  | "Gantry"
  | "LED Billboard"
  | "Wall Drape"
  | "Lamp Post"
  | "Roof Top"
  | "Trivision/Ultrawave"
  | "Portrait"
  | "Backlit/Landscape"
  | "Bridge Panel"
  | "Mega Billboard"
  | "Long Banner"
  | "Sign Board"
  | "Mobile Bill Board"
  | "Large Format"
  | "Glass Panel"
  | "48 Sheet"
  | "BRT"
  | "Bulletin Board"
  | "Arc Flag"
  | "Ultra wave billboard"
  | "Frontlit Billboard"
  | "Building Wrap"
  | "Car park roof Gantry"
  | "Car Display"
  | "Airport digital signage"
  | "Tower Branding"
  | "Led Lamp post billboard"
  | "Portrait Led billboard"
  | "Revolving Portrait Billboard"
  | "Unipole LED Billboard"
  | "96 Sheet Billboard"
  | "Static Light Box Lamp Post Billboard";

/**LOCATION */
export type location = {
  stateName: string;
};

export type area = {
  stateArea: string;
};

export type locationPayload = {
  stateArea: string;
  stateName: string;
};

export interface LocationDocument extends Document {
  stateName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AreaDocument extends Document {
  stateArea: string;
  location: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AreaModel extends Model<AreaDocument> {}

export interface LocationDocument extends Document {
  stateName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationModel extends Model<LocationDocument> {}

export interface LocationService {
  createState(stateName: string): Promise<LocationDocument>;
  createArea(location: locationPayload): Promise<AreaDocument>;
  getState(state: string): Promise<LocationDocument>;
  getArea(area: string, state: string): Promise<AreaDocument>;
  getAllStates(
    pages: number,
    limit: number
  ): Promise<{
    states: LocationDocument[];
    totalPages: number;
    pages: number;
  }>;
  getAllAreasInASpecificState(
    stateName: string,
    pages: number,
    limit: number
  ): Promise<{ areas: AreaDocument[]; totalPages: number; pages: number }>;
}

/** ORDER */
export interface OrderDocument extends Document {
  user: string;
  userDetails: string;
  product: string;
  invoice: string;
  dateRequested: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderModel extends Model<OrderDocument> {}

export type orderPayload = {
  userId: string;
  productId: string;
  dateRequested: string;
  status: "Pending" | "Fulfilled";
};

export interface OrderService {
  createOrder: (order: orderPayload) => Promise<void>;
}

/** QUOTE */
export interface QuoteDocument extends Document {
  title: string;
  price: string;
  availableFrom: Date;
  availableTo: Date;
  orderId: ObjectId;
  invoice: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteModel extends Model<QuoteDocument> {}

export type quotePayload = {
  title: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  description: string;
};
