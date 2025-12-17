import { UserService } from "../src/services/user.service";
import { Conflict, NotFound } from "../src/utils/error";
import { ObjectId } from "mongodb";
import { User } from "../src/models/user";

jest.mock("../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../src/utils/argon", () => ({
  verifyPassword: jest.fn().mockReturnValue(false),
}));

jest.mock("../src/models/user", () => {
  const mockUser: any = jest.fn();
  mockUser.findOne = jest.fn();
  mockUser.findOneAndUpdate = jest.fn();
  mockUser.findByCredentials = jest.fn();
  mockUser.findByIdAndDelete = jest.fn();
  mockUser.findByIdAndUpdate = jest.fn();
  mockUser.prototype.save = jest.fn();
  mockUser.prototype.generateAuthToken = jest.fn();

  return { User: mockUser };
});

jest.mock("mongodb", () => ({
  ObjectId: jest.fn((id) => `mock-id-${id}`),
}));

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  test("Should throw a NOTFOUND error if not found (getSpecificUser)", async () => {
    const user = User.findOne as jest.Mock;
    user.mockResolvedValueOnce(null);

    const id = "12345rtt67543";

    await expect(userService.getSpecificUser(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("Should return a specific user if found.", async () => {
    const id = "12345rtt67543";
    const mockValue = { _id: id, firstName: "John" };

    const user = User.findOne as jest.Mock;
    user.mockResolvedValueOnce(mockValue);

    const getSpecificUser = await userService.getSpecificUser(id);

    expect(getSpecificUser).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });
  test("should throw a CONFLICT error if email already exists.", async () => {
    const user = User.findOne as jest.Mock;
    user.mockResolvedValueOnce({});

    const payload = {
      fullName: "james",
      email: "str@example.com",
      phoneNo: 823323232,
      password: "qwertthup12.",
      companyName: "ShowBizLLC",
      position: "manager",
    };

    await expect(userService.createUser(payload)).rejects.toThrow(Conflict);
  });

  test("should save and return User if credentials are valid", async () => {
    const findEmail = User.findOne as jest.Mock;
    findEmail.mockResolvedValue(null);

    const saveMock = User.prototype.save as jest.Mock;
    saveMock.mockResolvedValue({});

    const payload = {
      fullName: "james",
      email: "str@example.com",
      phoneNo: 823323232,
      password: "qwertthup12.",
      companyName: "ShowBizLLC",
      position: "manager",
    };

    await userService.createUser(payload);
    expect(saveMock).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if credentials arent valid", async () => {
    const user = User.findByCredentials as jest.Mock;
    user.mockRejectedValueOnce(
      new NotFound("Wrong email/password combination")
    );

    const loginPayload = {
      email: "qwer@example.com",
      password: "poiuytrewq1234567890",
    };

    await expect(userService.login(loginPayload)).rejects.toThrow(NotFound);
  });

  test("should throw a NOTFOUND error if password doesnt match", async () => {
    const payload = {
      fullName: "james",
      email: "str@example.com",
      phoneNo: 823323232,
      password: "qwertthup12.",
      companyName: "ShowBizLLC",
      position: "manager",
    };

    await userService.createUser(payload);

    const loginPayload = {
      email: "str@example.com",
      password: "qwer2.",
    };

    await expect(userService.login(loginPayload)).rejects.toThrow(NotFound);
  });
  test("should sucessfully login if credentials match", async () => {
    const loginPayload = {
      email: "sam23@example.com",
      password: "1234445",
    };

    const mockInstance = {
      ...loginPayload,
      generateAuthToken: jest.fn().mockResolvedValue("token-123"),
    };

    (User.findByCredentials as jest.Mock).mockResolvedValue(mockInstance);

    const login = await userService.login(loginPayload);

    expect(User.findByCredentials).toHaveBeenCalledTimes(1);
    expect(mockInstance.generateAuthToken).toHaveBeenCalled();
    expect(login).toEqual({ user: mockInstance, token: "token-123" });
  });

  test("should log out user from a device", async () => {
    const mockSave = jest.fn().mockResolvedValue({});

    const req = {
      token: "token-123",
      user: {
        tokens: [{ token: "token-123" }, { token: "token34343" }],
        save: mockSave,
      },
    };

    await userService.logout(req);

    expect(req.user.tokens).toEqual([{ token: "token34343" }]);
    expect(mockSave).toHaveBeenCalled();
  });

  test("should log user out from all devices", async () => {
    const mockSave = jest.fn().mockResolvedValue({});

    const req = {
      token: "tokena-134",
      user: {
        tokens: [{ token: "token-2322" }, { token: "eerertpkem" }],
        save: mockSave,
      },
    };

    await userService.logoutFromAllDevices(req);
    expect(req.user.tokens).toEqual([]);
    expect(mockSave).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if user doesnt exist (updateUserInfo)", () => {
    const user = User.findOneAndUpdate as jest.Mock;
    user.mockResolvedValue(null);

    const id = "223456789";

    const payload = {
      fullName: "whatever",
      comapnyName: "ShowbixLLC",
      phoneNo: undefined,
      position: undefined,
    };

    expect(userService.updateUserInfo(id, payload)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should update a user if user exists (updateUserInfo)", async () => {
    const mockValue = {
      fullName: "whatever",
      comapnyName: "ShowbixLLC",
      phoneNo: 235434,
      position: "manager",
    };
    const user = User.findOneAndUpdate as jest.Mock;
    user.mockResolvedValue(mockValue);
    const id = "223456789";

    const payload = {
      fullName: "whatever",
      comapnyName: "ShowbixLLC",
      phoneNo: undefined,
      position: undefined,
    };
    const updateInfo = await userService.updateUserInfo(id, payload);

    expect(updateInfo).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if user doesnt exist (updatePassword)", () => {
    const user = User.findOneAndUpdate as jest.Mock;
    user.mockResolvedValue(null);

    const id = "223456789";

    const password = "tokendtgshsjkm";

    expect(userService.updatePassword(id, password)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should update a user if user exists (updatePassword)", async () => {
    const mockValue = {
      fullName: "whatever",
      comapnyName: "ShowbixLLC",
      phoneNo: 235434,
      position: "manager",
    };
    const user = User.findOneAndUpdate as jest.Mock;
    user.mockResolvedValue(mockValue);
    const id = "223456789";

    const password = "tokendtgshsjkm";
    const updateInfo = await userService.updatePassword(id, password);

    expect(updateInfo).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if user doesnt exist (deletePassword)", () => {
    const user = User.findByIdAndUpdate as jest.Mock;
    user.mockResolvedValue(null);

    const id = "223456789";
    expect(userService.deleteUser(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should delete a user if user exists (deletePassword)", async () => {
    const mockValue = {
      fullName: "whatever",
      comapnyName: "ShowbixLLC",
      phoneNo: 235434,
      position: "manager",
    };

    const user = User.findByIdAndUpdate as jest.Mock;
    user.mockResolvedValue(mockValue);
    const id = "223456789";
    const deleteOperation = await userService.deleteUser(id);

    expect(deleteOperation).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("uploads new avatar & destroys old one", async () => {
    const mockUpdateOne = jest.fn().mockResolvedValue(true);

    userService.getSpecificUser = jest.fn().mockResolvedValue({
      avatar: "https://mock.cloudinary.com/old-image.jpg",
      updateOne: mockUpdateOne,
    });

    const upload = jest
      .spyOn(userService as any, "upload")
      .mockReturnValue("https://mock.cloudinary.com/new-image.jpg");

    const mockFile = {
      path: "/tmp/file.jpg",
    } as Express.Multer.File;

    const result = await userService.uploadAvatar("id", mockFile);

    expect(upload).toHaveBeenCalled();
    expect(upload).toHaveBeenCalledWith(mockFile, "old-image");
    expect(result.newUrl).toBe("https://mock.cloudinary.com/new-image.jpg");
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { avatar: "https://mock.cloudinary.com/new-image.jpg" },
      { new: true, runValidators: true }
    );
  });
});
