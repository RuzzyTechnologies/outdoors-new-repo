import { Product } from "../src/models/products";
import { ProductService } from "../src/services/product.service";
import { NotFound } from "../src/utils/error";
import { ObjectId } from "mongodb";
import { LocationService } from "../src/services/location.service";

jest.mock("../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("mongodb", () => ({
  ObjectId: jest.fn((id) => `mocked-id-${id}`),
}));

jest.mock("../src/models/products", () => {
  const mockProduct: any = jest.fn();

  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({}),
  };

  mockProduct.findOne = jest.fn();
  mockProduct.find = jest.fn().mockReturnValue(mockQuery);
  mockProduct.prototype.save = jest.fn();
  mockProduct.countDocuments = jest.fn();
  mockProduct.findOneAndUpdate = jest.fn();
  mockProduct.findByIdAndDelete = jest.fn();

  return { Product: mockProduct };
});

jest.mock("../src/services/location.service", () => {
  const mockLocationService: any = jest.fn();

  mockLocationService.prototype.getState = jest
    .fn()
    .mockResolvedValue({ _id: 23343463365663 });
  mockLocationService.prototype.getArea = jest
    .fn()
    .mockResolvedValue({ _id: 23343463365663 });

  return { LocationService: mockLocationService };
});

describe("ProductService", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  test("Should succcessfully create a product", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    (Product.prototype.save as jest.Mock) = mockSave;

    (LocationService.prototype.getState as jest.Mock) = mockSave;
    (LocationService.prototype.getArea as jest.Mock) = mockSave;

    const id = "ajscsfgrfbhb";

    const productPayload = {
      title: "sumn",
      category: "All",
      availability: true,
      description: "random",
      quantity: "",
      featured: true,
      size: "dunno",
      address: "4, olagunto str.",
    };

    const locationPayload = { stateName: "Oyo", stateArea: "Iseyin" };

    await productService.createProduct(id, productPayload, locationPayload);

    expect(mockSave).toHaveBeenCalled();
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if ID isnt valid (upload new image)", async () => {
    productService.getSpecificProduct = jest
      .fn()
      .mockRejectedValue(new NotFound("Product doesn't exist."));

    const mockFile = {
      path: "/tmp/file.jpg",
    } as Express.Multer.File;

    await expect(productService.uploadImage("id", mockFile)).rejects.toThrow(
      NotFound
    );
  });

  test("should upload new image successfully.", async () => {
    const mockSave = jest.fn().mockResolvedValue(true);

    productService.getSpecificProduct = jest.fn().mockResolvedValue({
      image: {
        url: "https://mock.cloudinary.com/old-image.jpg",
        name: "old-image",
        mimetype: "image/png",
        size: "5mb",
      },
      save: mockSave,
    });

    const upload = jest.spyOn(productService as any, "upload").mockReturnValue({
      fileName: "new-image",
      size: "3mb",
      mimetype: "immage/png",
      url: "https://mock.cloudinary.com/new-image.jpg",
    });

    const mockFile = {
      path: "/tmp/file.jpg",
    } as Express.Multer.File;

    const result = await productService.uploadImage("id", mockFile);

    expect(upload).toHaveBeenCalled();
    expect(upload).toHaveBeenCalledWith(mockFile, "old-image");
    expect(result.url).toBe("https://mock.cloudinary.com/new-image.jpg");
    expect(mockSave).toHaveBeenCalled();
  });

  test("return a product if found", async () => {
    const id = "12346543";
    const mockValue = {
      id,
      title: "what",
      image: {
        url: "terwewewe.com",
      },
    };

    const product = Product.findOne as jest.Mock;
    product.mockResolvedValue(mockValue);

    const getProduct = await productService.getSpecificProduct(id);

    expect(getProduct).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("return a NOTFOUND error if ID isnt valid", async () => {
    const id = "12346543";

    const product = Product.findOne as jest.Mock;
    product.mockRejectedValue(new NotFound("Product doesn't exist."));

    expect(productService.getSpecificProduct(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("return a NOTFOUND error if no product has been created (getAllProducts).", async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const countDoc = Product.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(5);

    (Product.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockRejectedValue(new NotFound("No product found"));

    expect(productService.getAllProducts(1, 5)).rejects.toThrow(NotFound);
  });

  test("return all products. ", async () => {
    const countDoc = Product.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(5);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const mockValue = [
      {
        title: "sumn",
        featured: true,
      },
      { title: "sumn", featured: false },
    ];

    (Product.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockResolvedValue(mockValue);

    const getAll = await productService.getAllProducts(1, 5);

    expect(getAll.products).toEqual(mockValue);
    expect(getAll.totalPages).toEqual(5 / 5);
    expect(getAll.page).toEqual(1);
    expect(Product.find).toHaveBeenCalled();
    expect(Product.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test("return a NOTFOUND error if ID isnt valid (updateProduct)", async () => {
    const id = "12346543";

    const product = Product.findOneAndUpdate as jest.Mock;
    product.mockRejectedValue(new NotFound("Product doesn't exist."));

    const payload = {
      title: "what",
      category: "All",
      availability: true,
      description: "erty",
      quantity: "45p",
      featured: true,
      size: "2345",
      address: "",
    };

    expect(productService.updateProduct(id, payload)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("update a product successfully)", async () => {
    const id = "12346543";
    const payload = {
      title: "what",
      category: "All",
      availability: true,
      description: "erty",
      quantity: "45p",
      featured: true,
      size: "2345",
      address: "",
    };

    const product = Product.findOneAndUpdate as jest.Mock;
    product.mockResolvedValue(payload);

    const updateProduct = await productService.updateProduct(id, payload);

    expect(updateProduct).toEqual(payload);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("return a NOTFOUND error if ID isnt valid (deleteProduct)", async () => {
    const id = "12346543";

    const product = Product.findByIdAndDelete as jest.Mock;
    product.mockRejectedValue(new NotFound("Product doesn't exist."));

    expect(productService.deleteProduct(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should successfully delete a product.", async () => {
    const id = "12346543";
    const mockValue = {
      title: "sumn",
      featured: true,
    };

    const product = Product.findByIdAndDelete as jest.Mock;
    product.mockResolvedValue(mockValue);

    const deleteProduct = await productService.deleteProduct(id);

    expect(deleteProduct).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("should throw a NOTFOUND error if no product has been created. (getProductsByState).", async () => {
    const mockResolved = jest.fn().mockResolvedValue({});
    (LocationService.prototype.getState as jest.Mock) = mockResolved;

    const countDoc = Product.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(10);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    (Product.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockRejectedValue(new NotFound("Products not found."));

    expect(productService.getProductsByState("Lagos", 1, 10)).rejects.toThrow(
      NotFound
    );
  });

  test("should fetch all products in a state", async () => {
    const mockResolved = jest.fn().mockResolvedValue({});
    (LocationService.prototype.getState as jest.Mock) = mockResolved;

    const countDoc = Product.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(10);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const mockValue = [
      {
        title: "sumn",
        featured: true,
      },
      { title: "sumn", featured: false },
    ];

    (Product.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockResolvedValue(mockValue);

    const getProductsByState = await productService.getProductsByState(
      "Lagos",
      1,
      10
    );

    expect(getProductsByState.products).toEqual(mockValue);
    expect(getProductsByState.totalPages).toEqual(10 / 10);
    expect(getProductsByState.page).toEqual(1);
    expect(Product.find).toHaveBeenCalled();
    expect(Product.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test("should throw a NOTFOUND error if no product has been created (getProductsByArea).", async () => {
    const mockResolved = jest.fn().mockResolvedValue({});
    (LocationService.prototype.getState as jest.Mock) = mockResolved;
    (LocationService.prototype.getArea as jest.Mock) = mockResolved;

    const countDoc = Product.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(10);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    (Product.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockRejectedValue(new NotFound("Products not found."));

    expect(
      productService.getProductsByArea("Lagos", "Alimosho", 1, 10)
    ).rejects.toThrow(NotFound);
  });

  test("should fetch all products in a certain area", async () => {
    const mockResolved = jest.fn().mockResolvedValue({});
    (LocationService.prototype.getState as jest.Mock) = mockResolved;
    (LocationService.prototype.getArea as jest.Mock) = mockResolved;

    const countDoc = Product.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(10);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const mockValue = [
      {
        title: "sumn",
        featured: true,
      },
      { title: "sumn", featured: false },
    ];

    (Product.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockResolvedValue(mockValue);

    const getProductsByState = await productService.getProductsByArea(
      "Lagos",
      "Almosho",
      1,
      10
    );

    expect(getProductsByState.products).toEqual(mockValue);
    expect(getProductsByState.totalPages).toEqual(10 / 10);
    expect(getProductsByState.page).toEqual(1);
    expect(Product.find).toHaveBeenCalled();
    expect(Product.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });
});
