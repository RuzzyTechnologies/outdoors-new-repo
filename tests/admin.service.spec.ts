import { AdminService } from "../src/services/admin.service";
import { Admin } from "../src/models/admin";
import { Conflict, InternalServerError } from "../src/utils/error";

jest.mock("../src/utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
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
  mockAdmin.prototype.save = jest.fn();
  return { Admin: mockAdmin };
});

describe("AdminService - create", () => {
  let adminService: AdminService;

  beforeEach(() => {
    adminService = new AdminService();
    jest.clearAllMocks();
  });

  test("should throw confict if email already exists", () => {
    (Admin.findOne as jest.Mock).mockResolvedValueOnce({});

    const payload = {
      firstName: "Sam",
      lastName: "Dothe",
      username: "doth3",
      email: "sam@example.com",
      password: "1234445",
    };

    expect(adminService.createAdmin(payload)).rejects.toThrow(Conflict);
  });

  test("shoud throw conflict if username already exists", () => {
    (Admin.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({});

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
    (Admin.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

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
});
