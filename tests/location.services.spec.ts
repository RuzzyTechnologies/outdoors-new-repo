import { LocationService } from "../src/services/location.service";
import { State, Area } from "../src/models/location";
import { ObjectId } from "mongodb";
import { Conflict, NotFound } from "../src/utils/error";

jest.mock("../src/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../src/models/location", () => {
  const mockState: any = jest.fn();
  mockState.findOne = jest.fn();
  mockState.find = jest.fn();
  mockState.prototype.save = jest.fn();
  mockState.countDocuments = jest.fn();

  const mockArea: any = jest.fn();
  mockArea.find = jest.fn();
  mockArea.findOne = jest.fn();
  mockArea.prototype.save = jest.fn();
  mockArea.countDocuments = jest.fn();

  return { Area: mockArea, State: mockState };
});

jest.mock("mongodb", () => ({
  ObjectId: jest.fn((id) => `mocked-id-${id}`),
}));

describe("LocationService", () => {
  let locationService: LocationService;

  beforeEach(() => {
    locationService = new LocationService();
    jest.clearAllMocks();
  });

  test("should throw a Conflict Error if state already exists", () => {
    const state = State.findOne as jest.Mock;
    state.mockResolvedValue({});

    expect(locationService.createState("Lagos")).rejects.toThrow(Conflict);
  });

  test("should successfully create a state", async () => {
    const saveMock = jest.fn().mockResolvedValue({});
    (State.prototype.save as jest.Mock) = saveMock;

    const state = State.findOne as jest.Mock;
    state.mockResolvedValue(null);

    await locationService.createState("Lagos");
    expect(saveMock).toHaveBeenCalled();
  });

  test("should throw a NotFound error if state doesn't exist (createArea)", async () => {
    const rejectedMock = jest
      .fn()
      .mockRejectedValue(new NotFound("State not found."));
    (locationService.getState as jest.Mock) = rejectedMock;

    const locationPayload = { stateArea: "Alimosho", stateName: "Lagos" };

    expect(locationService.createArea(locationPayload)).rejects.toThrow(
      NotFound
    );
  });

  test("should throw a Conflict error if area already exists", () => {
    const resolvedMock = jest.fn().mockResolvedValue({ _id: new ObjectId() });
    (locationService.getState as jest.Mock) = resolvedMock;

    const area = Area.findOne as jest.Mock;
    area.mockResolvedValue({});

    const locationPayload = { stateArea: "Alimosho", stateName: "Lagos" };

    expect(locationService.createArea(locationPayload)).rejects.toThrow(
      Conflict
    );
  });

  test("should successfully create an area in a state", async () => {
    const _id = new ObjectId();
    const resolvedMock = jest.fn().mockResolvedValue({ _id });
    (locationService.getState as jest.Mock) = resolvedMock;

    const saveMock = jest.fn().mockResolvedValue({});
    (Area.prototype.save as jest.Mock) = saveMock;

    const area = Area.findOne as jest.Mock;
    area.mockResolvedValue(null);
    const locationPayload = { stateArea: "Alimosho", stateName: "Lagos" };

    await locationService.createArea(locationPayload);
    expect(Area.findOne).toHaveBeenCalledWith({
      stateArea: locationPayload.stateArea.toLowerCase(),
      location: _id,
    });
    expect(saveMock).toHaveBeenCalled();
  });

  test("should throw a NotFound error if state doesn't exist (getState)", () => {
    const state = State.findOne as jest.Mock;
    state.mockRejectedValue(new NotFound("State doesnt exist"));

    expect(locationService.getState("Lagos")).rejects.toThrow(NotFound);
  });

  test("should successfully fetch a state", async () => {
    const mockValue = {
      stateName: "lagos",
    };

    const state = State.findOne as jest.Mock;
    state.mockResolvedValue(mockValue);

    const getState = await locationService.getState("lagos");

    expect(State.findOne).toHaveBeenCalled();
    expect(getState).toEqual(mockValue);
  });

  test("should throw a NotFound error if state doesn't exist (getArea)", () => {
    const rejectedMock = jest
      .fn()
      .mockRejectedValue(new NotFound("State doesnt exist."));
    (locationService.getState as jest.Mock) = rejectedMock;

    expect(locationService.getArea("Ikeja", "Lagos")).rejects.toThrow(NotFound);
  });

  test("should successfully fetch an area in a state", async () => {
    const _id = new ObjectId();
    const resolvedMock = jest.fn().mockResolvedValue({ _id });
    (locationService.getState as jest.Mock) = resolvedMock;

    const state = Area.findOne as jest.Mock;
    state.mockRejectedValue(new NotFound("Area doesnt exist"));

    expect(locationService.getArea("Ikeja", "Lagos")).rejects.toThrow(NotFound);
  });

  test("should successfully fetch an area in a state", async () => {
    const _id = new ObjectId();
    const resolvedMock = jest.fn().mockResolvedValue({ _id });
    (locationService.getState as jest.Mock) = resolvedMock;

    const mockValue = {
      stateArea: "alimosho",
      location: _id,
    };

    const state = Area.findOne as jest.Mock;
    state.mockResolvedValue(mockValue);

    const getArea = await locationService.getArea("alimosho", "lagos");

    expect(Area.findOne).toHaveBeenCalled();
    expect(getArea).toEqual(mockValue);
  });

  test("should throw a NotFound error if no state has been created (getAllStates)", async () => {
    const countDoc = State.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(null);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    (State.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockRejectedValue(new NotFound("No state found."));

    expect(locationService.getAllStates(1, 10)).rejects.toThrow(NotFound);
  });

  test("should successfully fetch all states (getAllStates).", async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const mockValue = [
      {
        stateName: "sumn",
      },
      { stateName: "another" },
    ];

    const countDoc = State.countDocuments as jest.Mock;
    countDoc.mockResolvedValue(50);

    (State.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockResolvedValue(mockValue);

    const getAllStates = await locationService.getAllStates(2, 10);

    expect(getAllStates.states).toEqual(mockValue);
    expect(getAllStates.totalPages).toEqual(50 / 10);
    expect(getAllStates.pages).toEqual(2);
    expect(State.find).toHaveBeenCalled();
  });

  test("should throw a NotFound error if state doesnt exist (getAllAreasInASpecificState)", () => {
    const rejectedMock = jest
      .fn()
      .mockRejectedValue(new NotFound("State not found."));
    (locationService.getState as jest.Mock) = rejectedMock;

    expect(
      locationService.getAllAreasInASpecificState("lagos", 1, 50)
    ).rejects.toThrow(NotFound);
  });

  test("should throw a NotFound error if no area has been created in a state (getAllAreasInASpecificState)", () => {
    const _id = new ObjectId();
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const resolvedMock = jest.fn().mockResolvedValue({ _id });
    (locationService.getState as jest.Mock) = resolvedMock;

    (Area.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockRejectedValue(new NotFound("No area found"));

    expect(
      locationService.getAllAreasInASpecificState("lagos", 1, 50)
    ).rejects.toThrow(NotFound);
  });

  test("should successfully fetch all the areas in a state (getAllAreasInASpecificState)", async () => {
    const _id = new ObjectId();
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    const mockResult = [
      { statArea: "Alimosho", location: new ObjectId() },
      { statArea: "Ikeja", location: new ObjectId() },
    ];

    const resolvedMock = jest.fn().mockResolvedValue({ _id });
    (locationService.getState as jest.Mock) = resolvedMock;

    (Area.countDocuments as jest.Mock).mockResolvedValue(60);
    (Area.find as jest.Mock).mockReturnValue(mockQuery);
    mockQuery.limit.mockResolvedValue(mockResult);

    const getAllAreasInASpecificState =
      await locationService.getAllAreasInASpecificState("Lagos", 3, 10);

    expect(Area.find).toHaveBeenCalledWith({ location: _id });
    expect(Area.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(getAllAreasInASpecificState.areas).toEqual(mockResult);
    expect(getAllAreasInASpecificState.pages).toEqual(3);
    expect(getAllAreasInASpecificState.totalPages).toEqual(60 / 10);
  });
});
