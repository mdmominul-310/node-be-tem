import httpStatus from "http-status";
import responseReturn from "./responseReturn";
import ApiError from "../errors/ApiError";
import User from "../app/modules/users/user.model";

class ServiceModel {
  Response: typeof responseReturn;
  AppError: typeof ApiError;
  HttpStatus: typeof httpStatus;
  User: typeof User;
  constructor() {
    this.Response = responseReturn;
    this.AppError = ApiError;
    this.HttpStatus = httpStatus;
    this.User = User;
  }

  public readonly queryMaker = (query: Record<string, string>) => {
    const { limit, page, sort, ...rest } = query;
    const limitQuery = limit ? parseInt(limit) : 10;
    const pageQuery = page ? parseInt(page) : 1;
    const sortQuery = sort ? sort : "-createdAt";
    const skipQuery = (pageQuery - 1) * limitQuery;
    const filter: Record<string, string> = {};
    if (rest) {
      Object.keys(rest).forEach((key) => {
        if (rest[key] !== "undefined" && rest[key] !== "null") {
          filter[key] = rest[key];
        }
      });
    }
    return { limitQuery, pageQuery, sortQuery, skipQuery, filter };
  };
  public getUniqueKey(prefix: string): string {
    const timestamp = new Date().getTime();
    const toStingTimestamp = `${timestamp}`.slice(3, 13);
    const uniqueIdentifier = Math.floor(Math.random() * 1000);

    return `${
      prefix.slice(0, 3).toUpperCase() || "UID"
    }${uniqueIdentifier}${toStingTimestamp}`;
  }

  test() {
    console.log("test");
  }
}

export default ServiceModel;
