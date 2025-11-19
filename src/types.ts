import { Document, Model } from "mongoose";
import { Admin } from "./models/admin.js";

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
  password: string;
  tokens: string[];
  email: string;
  generateAuthToken(): Promise<string>;
  toJSON(): Promise<any>;
}

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
