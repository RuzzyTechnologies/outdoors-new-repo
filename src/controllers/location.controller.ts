import { Response, NextFunction } from "express";

import { LocationController as LC, AuthenticatedRequest } from "../types";
import { LocationService } from "../services/location.service";
import { BadRequest } from "../utils/error";

export class LocationController implements LC {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  async createState(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { state } = req.body;
      if (!state)
        throw new BadRequest("Bad Request. Field (state) cannot be empty");

      const location = await this.locationService.createState(state);
      res.status(201).json({
        status: 201,
        message: "State created successfully",
        data: {
          state: location,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async createArea(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { area, state } = req.body;
      if (!area || !state)
        throw new BadRequest(
          "Bad Request. Field (area and state) cannot be empty"
        );

      const location = await this.locationService.createArea({
        stateArea: area,
        stateName: state,
      });
      res.status(201).json({
        status: 201,
        message: "Area created successfully",
        data: {
          state: location,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getArea(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { area, state } = req.query;

      const location = await this.locationService.getArea(
        area as string,
        state as string
      );
      res.status(200).json({
        status: 200,
        message: "Area fetched successfully!",
        data: {
          area: location,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async getState(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { state } = req.query;

      const location = await this.locationService.getState(state as string);
      res.status(200).json({
        status: 200,
        message: "State fetched successfully!",
        data: {
          area: location,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async getAllStates(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit } = req.query;
      const getStates = await this.locationService.getAllStates(
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        status: 200,
        message: "States fetched succcessfully!",
        data: {
          currentPage: getStates.pages,
          totalPages: getStates.totalPages,
          states: getStates.states,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async getAllAreasInASpecificState(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit } = req.query;
      const { state } = req.body;

      if (!state)
        throw new BadRequest("Bad Requtest. Field (state) cannot be empty");

      const getAllAreasInASpecificState =
        await this.locationService.getAllAreasInASpecificState(
          state as string,
          Number(page),
          Number(limit)
        );

      res.status(200).json({
        status: 2200,
        message: `Areas in ${state} fetched successfully!`,
        data: {
          currentPage: getAllAreasInASpecificState.pages,
          totalPages: getAllAreasInASpecificState.totalPages,
          areas: getAllAreasInASpecificState.areas,
        },
      });
    } catch (e) {
      next(e);
    }
  }
}
