import { AdminService } from "../src/services/admin.service";
import { Admin } from "../src/models/admin";
import { Conflict, NotFound } from "../src/utils/error";
import { ObjectId } from "mongodb";

jest.mock("../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../src/utils/argon", () => ({
  verifyPassword: jest.fn().mockReturnValue(false),
}));

jest.mock("../src/models/admin", () => {
  // Admin: {
  //   findOne: jest.fn(),
  //   prototype: {
  //     save: jest.fn(),
  //   },
  // },

  const mockAdmin: any = jest.fn();
  mockAdmin.findOne = jest.fn();
  mockAdmin.findOneAndUpdate = jest.fn();
  mockAdmin.findByCredentials = jest.fn();
  mockAdmin.findByIdAndDelete = jest.fn();
  mockAdmin.prototype.save = jest.fn();
  mockAdmin.prototype.generateAuthToken = jest.fn();
  return { Admin: mockAdmin };
});

jest.mock("mongodb", () => ({
  ObjectId: jest.fn((id) => `mocked-id-${id}`),
}));

describe("AdminService", () => {
  let adminService: AdminService;

  beforeEach(() => {
    adminService = new AdminService();
    jest.clearAllMocks();
  });

  test("should throw a CONFLICT error if email already exists", () => {
    const admin = Admin.findOne as jest.Mock;
    admin.mockResolvedValueOnce({});

    const payload = {
      firstName: "Sam",
      lastName: "Dothe",
      username: "doth3",
      email: "sam@example.com",
      password: "1234445",
    };

    expect(adminService.createAdmin(payload)).rejects.toThrow(Conflict);
  });

  test("shoud throw a CONFLICT if username already exists", () => {
    const admin = Admin.findOne as jest.Mock;
    admin.mockResolvedValue(null).mockResolvedValue({});

    const payload = {
      firstName: "Sam",
      lastName: "Dothe",
      username: "doth3",
      email: "sam@example.com",
      password: "1234445",
    };

    expect(adminService.createAdmin(payload)).rejects.toThrow(Conflict);
  });

  test("should create admin when valid", async () => {
    const admin = Admin.findOne as jest.Mock;
    admin.mockResolvedValue(null).mockResolvedValue(null);

    const saveMock = jest.fn().mockResolvedValue({});
    (Admin.prototype.save as jest.Mock) = saveMock;

    const payload = {
      firstName: "Sam",
      lastName: "Dothe",
      username: "doth3",
      email: "sam2@example.com",
      password: "1234445",
    };

    await adminService.createAdmin(payload);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  // LOGIN
  test("should throw a NOTFOUND error if email doesnt exist", async () => {
    const admin = Admin.findByCredentials as jest.Mock;
    admin.mockRejectedValue(new NotFound("Wrong email/password combination"));

    const payload = {
      email: "sam23@gmail.com",
      loginPassword: "333333",
    };

    await expect(adminService.login(payload)).rejects.toThrow(NotFound);
  });

  test("should throw a NOTFOUND error if password doesnt match", async () => {
    const payload = {
      firstName: "Sam",
      lastName: "Dothe",
      username: "doth3",
      email: "sam23@example.com",
      password: "1234445",
    };

    await adminService.createAdmin(payload);

    const loginPayload = {
      email: "sam23@example.com",
      loginPassword: "333333",
    };

    await expect(adminService.login(loginPayload)).rejects.toThrow(NotFound);
  });

  test("should sucessfully login if credentials match", async () => {
    const loginPayload = {
      email: "sam23@example.com",
      loginPassword: "1234445",
    };

    const mockInstance = {
      ...loginPayload,
      generateAuthToken: jest.fn().mockResolvedValue("token-123"),
    };

    (Admin.findByCredentials as jest.Mock).mockResolvedValue(mockInstance);

    const login = await adminService.login(loginPayload);

    expect(Admin.findByCredentials).toHaveBeenCalledTimes(1);
    expect(mockInstance.generateAuthToken).toHaveBeenCalled();
    expect(login).toEqual({ admin: mockInstance, token: "token-123" });
  });

  test("should log out user from a device", async () => {
    const mockSave = jest.fn().mockResolvedValue({});

    const req = {
      token: "token-123",
      admin: {
        tokens: [{ token: "token-123" }, { token: "token34343" }],
        save: mockSave,
      },
    };

    await adminService.logout(req);

    expect(req.admin.tokens).toEqual([{ token: "token34343" }]);
    expect(mockSave).toHaveBeenCalled();
  });

  test("should log out user from all devices", async () => {
    const mockSave = jest.fn().mockResolvedValue({});

    const req = {
      token: "token-123",
      admin: {
        tokens: [{ token: "token-123" }, { token: "token34343" }],
        save: mockSave,
      },
    };

    await adminService.logoutFromAllDevices(req);

    expect(req.admin.tokens).toEqual([]);
    expect(mockSave).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if admin doesnt exist", () => {
    const admin = Admin.findOneAndUpdate as jest.Mock;
    admin.mockResolvedValue(null);

    const id = "123455678902";

    const payload = {
      firstName: "Sam",
      lastName: "Dothe",
      username: "doth3",
    };

    expect(adminService.updateAdminInfo(id, payload)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should update provided fields if admin exists", async () => {
    const id = "123455678902";

    const admin = Admin.findOneAndUpdate as jest.Mock;
    admin.mockResolvedValue({ _id: id, firstName: "John" });

    const payload = {
      firstName: "John",
    };
    const update = await adminService.updateAdminInfo(id, payload);

    expect(update.firstName).toEqual("John");
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if admin doesnt exist (password update)", () => {
    const admin = Admin.findOneAndUpdate as jest.Mock;
    admin.mockResolvedValue(null);

    const id = "123455678902";
    const password = "123433ioo";

    expect(adminService.updatePassword(id, password)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should update provided fields if admin exists (password update)", async () => {
    const id = "123455678902";

    const admin = Admin.findOneAndUpdate as jest.Mock;
    admin.mockResolvedValue({ _id: id, password: "hashedPas234" });

    const password = "John";
    const update = await adminService.updatePassword(id, password);

    expect(update.password).toEqual("hashedPas234");
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if admin doesnt exist", async () => {
    const admin = Admin.findByIdAndDelete as jest.Mock;
    admin.mockResolvedValue(null);

    const id = "123455678902";

    expect(adminService.deleteAdmin(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should successfully delete admin if found", async () => {
    const id = "123455678902";
    const mockAdmin = { _id: id, firstName: "John" };

    const admin = Admin.findByIdAndDelete as jest.Mock;
    admin.mockResolvedValue(mockAdmin);

    const deleteOperation = await adminService.deleteAdmin(id);

    expect(deleteOperation).toEqual(mockAdmin);
    expect(ObjectId).toHaveBeenCalled();
  });
  test("Should throw a NOTFOUND error if not found (getSpecificAdmin)", async () => {
    const admin = Admin.findOne as jest.Mock;
    admin.mockResolvedValueOnce(null);

    const id = "12345rtt67543";

    await expect(adminService.getSpecificAdmin(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("Should return a specific user if found.", async () => {
    const id = "12345rtt67543";
    const mockValue = { _id: id, firstName: "John" };

    const admin = Admin.findOne as jest.Mock;
    admin.mockResolvedValueOnce(mockValue);

    const getSpecificAdmin = await adminService.getSpecificAdmin(id);

    expect(getSpecificAdmin).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });
});
