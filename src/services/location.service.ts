import { Area, State } from "../models/location";
import { NotFound, InternalServerError } from "../utils/error";
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

  async createState(location: locationPayload) {
    try {
      let state;

      const { stateName } = location;

      state = await this.locationRepository.findOne({
        stateName: stateName.toLowerCase().trim(),
      });
      if (state) return state;

      state = new this.locationRepository({
        stateName: stateName.toLowerCase().trim(),
      });
      await state.save();
      return state;
    } catch (e: any) {
      logger.error(`Error creating state...${e}`);
      throw new InternalServerError(`Error creating state...${e}`);
    }
  }

  async createArea(location: locationPayload) {
    try {
      const { stateName, stateArea } = location;
      const state = await this.getState(stateName.toLowerCase().trim());

      const area = new this.areaRepository({
        stateArea: stateArea.toLowerCase().trim(),
        location: state._id,
      });

      return area;
    } catch (e: any) {
      logger.error(`Error creating area...${e}`);
      throw new InternalServerError(`Error creating area...${e}`);
    }
  }

  async getState(state: string) {
    try {
      const location = await this.locationRepository.findOne({
        stateName: state.toLowerCase().trim(),
      });

      if (!location) {
        throw new NotFound("State doesn't exist.");
      }
      return location;
    } catch (e: any) {
      logger.error(`Error fetching state...${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching state...${e}`);
    }
  }

  async getArea(area: string) {
    try {
      const location = await this.areaRepository.findOne({
        stateArea: area.toLowerCase().trim(),
      });

      if (!location) {
        throw new NotFound("Area doesn't exist.");
      }
      return location;
    } catch (e: any) {
      logger.error(`Error fetching area...${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching area...${e}`);
    }
  }

  async getAllStates(pages: number, limit: number) {
    try {
      const page = pages || 1;
      const lim = limit || 10;

      const skip = (page - 1) * lim;
      const total = await this.locationRepository.countDocuments();

      const states = await this.locationRepository
        .findOne({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim);
      if (!states) throw new NotFound("No state found");

      return { states, total, page };
    } catch (e: any) {
      logger.error(`Error fetching states ${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching states...${e}`);
    }
  }

  async getAllAreasInASpecificState(
    stateName: string,
    pages: number,
    limit: number
  ) {
    try {
      const page = pages || 1;
      const lim = limit || 10;
      const skip = (page - 1) * lim;

      const state = await this.getState(stateName.toLowerCase().trim());
      const total = await this.areaRepository.countDocuments({
        location: state._id,
      });

      const areas = await this.areaRepository
        .findOne({ location: state._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim);
      if (!areas) throw new NotFound("No area found");

      return { areas, total, page };
    } catch (e: any) {
      logger.error(`Error fetching areas ${e}`);
      if (e instanceof NotFound) throw e;
      throw new InternalServerError(`Error fetching areas...${e}`);
    }
  }
}
