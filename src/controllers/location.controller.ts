import { Request, Response, NextFunction } from "express";

import { LocationController as LC } from "../types";
import { LocationService } from "../services/location.service";
import { BadRequest } from "../utils/error";

export class LocationController implements LC {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  /**
   * @openapi
   * /api/v1/locations/state:
   *   post:
   *     summary: Create a state
   *     description: Create a new state location
   *     tags:
   *       - Location
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateStateRequest"
   *     responses:
   *       201:
   *         description: State created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LocationResponse"
   *       400:
   *         description: Invalid request payload
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */
  createState = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequest("Bad Request. Field (state) cannot be empty");

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
  };

  /**
   * @openapi
   * /api/v1/locations/area:
   *   post:
   *     summary: Create an area within a state
   *     description: Create a new area under an existing state
   *     tags:
   *       - Location
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateAreaRequest"
   *     responses:
   *       201:
   *         description: Area created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/LocationResponse"
   *       400:
   *         description: Invalid request payload
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  createArea = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequest(
          "Bad Request. Field (area and state) cannot be empty"
        );

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
  };

  /**
   * @openapi
   * /api/v1/locations/area:
   *   get:
   *     summary: Get an area by name and state
   *     description: Fetch a specific area within a state
   *     tags:
   *       - Location
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: area
   *         required: true
   *         schema:
   *           type: string
   *         example: Ikeja
   *       - in: query
   *         name: state
   *         required: true
   *         schema:
   *           type: string
   *         example: Lagos
   *     responses:
   *       200:
   *         description: Area fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: Area fetched successfully!
   *                 data:
   *                   type: object
   *                   properties:
   *                     area:
   *                       $ref: "#/components/schemas/Location"
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */
  getArea = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  /**
   * @openapi
   * /api/v1/locations/state:
   *   get:
   *     summary: Get a state by name
   *     description: Fetch a state location
   *     tags:
   *       - Location
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: state
   *         required: true
   *         schema:
   *           type: string
   *         example: Lagos
   *     responses:
   *       200:
   *         description: State fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: State fetched successfully!
   *                 data:
   *                   type: object
   *                   properties:
   *                     area:
   *                       $ref: "#/components/schemas/Location"
   *       400:
   *         description: Invalid query parameter
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */
  getState = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  /**
   * @openapi
   * /api/v1/locations/states/all:
   *   get:
   *     summary: Get all states
   *     description: Fetch all states with pagination
   *     tags:
   *       - Location
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 10
   *     responses:
   *       200:
   *         description: States fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAllStatesResponse"
   *       400:
   *         description: Invalid pagination parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  getAllStates = async (req: Request, res: Response, next: NextFunction) => {
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
  };

  /**
   * @openapi
   * /api/v1/locations/areas:
   *   get:
   *     summary: Get all areas in a specific state
   *     description: Fetch paginated areas belonging to a given state
   *     tags:
   *       - Location
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: state
   *         required: true
   *         schema:
   *           type: string
   *         example: Lagos
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *         example: 10
   *     responses:
   *       200:
   *         description: Areas fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/GetAllAreasResponse"
   *       400:
   *         description: State query parameter is missing
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/ErrorResponse"
   */

  getAllAreasInASpecificState = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, state } = req.query;

      if (!state)
        throw new BadRequest("Bad Request. Field (state) cannot be empty");

      const getAllAreasInASpecificState =
        await this.locationService.getAllAreasInASpecificState(
          state as string,
          Number(page),
          Number(limit)
        );

      res.status(200).json({
        status: 200,
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
  };
}
