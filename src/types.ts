import { Document, Model } from "mongoose";
import { Admin } from "./models/admin.js";
import { User } from "./models/user.js";

/** ADMIN */

export interface AdminService {
  createAdmin: (payload: adminOptions) => Promise<admin>;
  login: (payload: loginOptions) => Promise<tokenizedAdmin>;
  logout: (payload: any) => Promise<admin>;
  updateAdminInfo: (id: string, paylaod: adminUpdateFields) => Promise<admin>;
  updatePassword: (id: string, password: string) => Promise<admin>;
  deleteAdmin: (id: string) => Promise<admin>;
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

type admin = typeof Admin;

type tokenizedAdmin = {
  admin: admin;
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
  admin: admin;
  token: string;
};

export type userUpdateFields = {
  fullname?: string;
  phoneNo?: number;
  companyName?: string;
  position?: string;
};

type user = typeof User;

export interface UserService {
  createAdmin: (payload: userOptions) => Promise<user>;
  login: (payload: loginOptions) => Promise<tokenizedUser>;
  logout: (payload: any) => Promise<user>;
  updateUserInfo: (id: string, paylaod: adminUpdateFields) => Promise<user>;
  updatePassword: (id: string, password: string) => Promise<user>;
  deleteAdmin: (id: string) => Promise<user>;
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
  findByCredentials(payload: loginOptions): Promise<AdminDocument>;
}

export interface CustomParams {
  folder: string;
  allowedFormats: string[];
}
