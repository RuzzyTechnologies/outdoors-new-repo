import { Area, State } from "../models/location";
import { NotFound, InternalServerError, Conflict } from "../utils/error";
import { logger } from "../utils/logger";
import { LocationService as LS } from "../types";
import type { locationPayload } from "../types";

export class LocationService implements LS {
  private locationRepository;
  private areaRepository;

  constructor() {
    this.locationRepository = State;
    this.areaRepository = Area;
  }

  async createState(stateName: string) {
    try {
      const state = await this.locationRepository.findOne({
        stateName: stateName.toLowerCase(),
      });
      if (state) throw new Conflict("State already exists");

      const newState = new this.locationRepository({
        stateName: stateName.toLowerCase(),
      });
      await newState.save();

      return newState;
    } catch (e: any) {
      if (e instanceof Conflict) throw e;
      logger.error(`Error creating state`);
      throw new InternalServerError(`Error creating state.`);
    }
  }

  async createArea(location: locationPayload) {
    try {
      const { stateName, stateArea } = location;
      const state = await this.getState(stateName);

      const area = await this.areaRepository.findOne({
        stateArea: stateArea.toLowerCase(),
        location: state._id,
      });
      if (area) throw new Conflict("Area already exists");

      const newArea = new this.areaRepository({
        stateArea: stateArea.toLowerCase(),
        location: state._id,
      });
      await newArea.save();

      return newArea;
    } catch (e: any) {
      logger.error(`Error creating area`);
      if (e instanceof Conflict) throw e;
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error creating area`);
    }
  }

  async getState(state: string) {
    try {
      const location = await this.locationRepository.findOne({
        stateName: state.toLowerCase(),
      });

      if (!location) {
        throw new NotFound("State doesn't exist.");
      }
      return location;
    } catch (e: any) {
      logger.error(`Error fetching state...${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching state.`);
    }
  }

  async getArea(area: string, stateName: string) {
    try {
      const state = await this.getState(stateName);
      const location = await this.areaRepository.findOne({
        stateArea: area.toLowerCase(),
        location: state._id,
      });

      if (!location) {
        throw new NotFound("Area doesn't exist.");
      }
      return location;
    } catch (e: any) {
      logger.error(`Error fetching area...${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching area`);
    }
  }

  async getAllStates(pages: number = 1, limit: number = 10) {
    try {
      const skip = (pages - 1) * limit;
      const total = await this.locationRepository.countDocuments();

      const states = await this.locationRepository
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (!states) throw new NotFound("No state found");

      return { states, totalPages: Math.ceil(total / limit), pages };
    } catch (e: any) {
      logger.error(`Error fetching states`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching states`);
    }
  }

  async getAllAreasInASpecificState(
    stateName: string,
    pages: number = 1,
    limit: number = 10
  ) {
    try {
      const skip = (pages - 1) * limit;

      const state = await this.getState(stateName);
      const total = await this.areaRepository.countDocuments({
        location: state._id,
      });

      const areas = await this.areaRepository
        .find({ location: state._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (!areas) throw new NotFound("No area found");

      return { areas, totalPages: Math.ceil(total / limit), pages };
    } catch (e: any) {
      logger.error(`Error fetching areas`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching areas`);
    }
  }
}
