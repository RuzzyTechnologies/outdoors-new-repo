import { ObjectId } from "mongodb";
import { OrderService } from "../src/services/order.service";
import { UserService } from "../src/services/user.service";
import { ProductService } from "../src/services/product.service";
import { Order, Quote } from "../src/models/order";
import { User } from "../src/models/user";
import { NotFound } from "../src/utils/error";

jest.mock("../src/models/order", () => {
  const mockOrder: any = jest.fn();
  const mockQuote: any = jest.fn();

  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({}),
  };

  mockOrder.findOne = jest.fn();
  mockOrder.find = jest.fn().mockReturnValue(mockQuery);
  mockOrder.prototype.save = jest.fn();
  mockOrder.countDocuments = jest.fn();

  mockQuote.findOne = jest.fn();
  mockQuote.find = jest.fn().mockReturnValue(mockQuery);
  mockQuote.prototype.save = jest.fn();
  mockQuote.countDocuments = jest.fn();
  mockQuote.findByIdAndUpdate = jest.fn();

  return { Order: mockOrder, Quote: mockQuote };
});

jest.mock("../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("mongodb", () => ({
  ObjectId: jest.fn((id) => `mocked-id-${id}`),
}));

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  test("successfully create a order", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    (Order.prototype.save as jest.Mock) = mockSave;

    (UserService.prototype.getSpecificUser as jest.Mock) = mockSave;
    (ProductService.prototype.getSpecificProduct as jest.Mock) = mockSave;

    const invoice = jest
      .spyOn(orderService as any, "createInvoiceString")
      .mockReturnValue("random-string-zzzz");
    const parseString = jest
      .spyOn(orderService as any, "parseStringArray")
      .mockReturnValue({});
    const parseDate = jest
      .spyOn(orderService as any, "parseDate")
      .mockReturnValue({});

    const orderPayload = {
      userId: "objectid-wwqwq",
      productId: "object-qwqr",
      dateRequested: "12/07/25",
      status: "Pending",
    };

    await orderService.createOrder(orderPayload);
    expect(mockSave).toHaveBeenCalled();
    expect(invoice).toHaveBeenCalled();
    expect(parseDate).toHaveBeenCalled();
    expect(parseString).toHaveBeenCalled();
  });

  test("throw a NOTFOUND error if order not found", async () => {
    const findOrder = Order.findOne as jest.Mock;
    findOrder.mockRejectedValue(new NotFound("order not found"));
    const id = "oeruyndsms";

    expect(orderService.findSpecificOrder(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("successfully return an order", async () => {
    const id = "oeruyndsms";
    const mockValue = {
      id,
      invoice: "12345664qwdf",
      dateRequested: new Date(),
    };

    const findOrder = Order.findOne as jest.Mock;
    findOrder.mockResolvedValue(mockValue);

    const order = await orderService.findSpecificOrder(id);

    expect(order).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("return a NOTFOUND error if no order has been created (getAllOrders).", async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const countDoc = Order.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(5);

    (Order.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockRejectedValue(new NotFound("No order found"));

    expect(orderService.getAllOrders(1, 5)).rejects.toThrow(NotFound);
  });

  test("return all orders. ", async () => {
    const countDoc = Order.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(50);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const mockValue = [
      {
        title: "sumn",
        dateRequested: new Date(),
      },
      { title: "sumn", dateRequested: new Date() },
    ];

    (Order.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockResolvedValue(mockValue);

    const getAll = await orderService.getAllOrders(1, 5);

    expect(getAll.orders).toEqual(mockValue);
    expect(getAll.totalPages).toEqual(50 / 5);
    expect(getAll.page).toEqual(1);
    expect(Order.find).toHaveBeenCalled();
    expect(Order.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  test("throw a NOTFOUND error if order not found when creating a quote", async () => {
    (orderService.findSpecificOrder as jest.Mock) = jest
      .fn()
      .mockRejectedValue(new NotFound("order not found"));
    const id = "oeruyndsms";
    const quotePayload = {
      title: "billboard in Lagos",
      price: 30.05,
      availableFrom: "27/04/25",
      availableTo: "27/04/25",
      description: "whatevsss",
    };

    expect(orderService.createQuote(id, quotePayload)).rejects.toThrow(
      NotFound
    );
  });

  test("successfully create a quote", async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    (Quote.prototype.save as jest.Mock) = mockSave;

    (OrderService.prototype.findSpecificOrder as jest.Mock) = mockSave;

    const quotePayload = {
      title: "billboard in Lagos",
      price: 30.05,
      availableFrom: "27/04/25",
      availableTo: "27/04/25",
      description: "whatevsss",
    };

    const parseDate = jest
      .spyOn(orderService as any, "parseDate")
      .mockReturnValue({});

    await orderService.createQuote("qwerty", quotePayload);
    expect(mockSave).toHaveBeenCalled();
    expect(parseDate).toHaveBeenCalledTimes(2);
  });

  test("throw a NOTFOUND error if quote not found", async () => {
    const findQuote = Quote.findOne as jest.Mock;
    findQuote.mockRejectedValue(new NotFound("order not found"));
    const id = "oeruyndsms";

    expect(orderService.findSpecificQuote(id)).rejects.toThrow(NotFound);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("successfully return an quote", async () => {
    const id = "oeruyndsms";
    const mockValue = {
      title: "title",
      price: 50,
      description: "description",
      availableFrom: new Date(),
    };

    const findOrder = Quote.findOne as jest.Mock;
    findOrder.mockResolvedValue(mockValue);

    const quote = await orderService.findSpecificQuote(id);

    expect(quote).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });

  test("throw a NOTFOUND error if quote not found before updation", async () => {
    const updateQuote = Quote.findByIdAndUpdate as jest.Mock;
    updateQuote.mockRejectedValue(new NotFound("order not found"));
    const id = "oeruyndsms";
    const quotePayload = {
      title: "billboard in Lagos",
      price: 30.05,
      availableFrom: "27/04/25",
      availableTo: "27/04/25",
      description: "whatevsss",
    };

    expect(orderService.updateQuote(id, quotePayload)).rejects.toThrow(
      NotFound
    );
    expect(ObjectId).toHaveBeenCalled();
  });

  test("successfully update a quote", async () => {
    const mockValue = {
      title: "billboard in Lagos",
      price: 30.05,
      availableFrom: "27/04/25",
      availableTo: "27/04/25",
    };

    const updateQuote = Quote.findByIdAndUpdate as jest.Mock;
    updateQuote.mockResolvedValue(mockValue);

    const id = "oeruyndsms";
    const quotePayload = {
      title: "billboard in Lagos",
      price: 30.05,
      availableFrom: "27/04/25",
      availableTo: "27/04/25",
      description: "whatevsss",
    };

    const update = await orderService.updateQuote(id, quotePayload);
    expect(update).toEqual(mockValue);
    expect(ObjectId).toHaveBeenCalled();
  });
});
