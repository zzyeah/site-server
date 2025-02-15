import { RequestHandler } from "express";
import { Model } from "sequelize";

export interface ResponseOptions {
  code?: number;
  msg?: string;
  data?: any;
}

export const getResult = function (result: ResponseOptions) {
  return {
    code: result.code || 0,
    msg: result.msg || "",
    data: typeof result.data === "boolean" ? result.data : result.data || null,
  };
};

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      const data = await handler(req, res, next);
      res.send(getResult({ data }));
    } catch (error) {
      next(error);
    }
  };
};

export const parseModelDataValue = (model: Model| any, result = {}) => {
  if (!isModel(model)) return result;
  const { dataValues } = model;
  for (const key in dataValues) {
    if (Object.prototype.hasOwnProperty.call(dataValues, key)) {
      const value = dataValues[key];
      result[key] = value;
      if (Array.isArray(value) || typeof value === "object") {
        for (const arrKey in value) {
          if (Object.prototype.hasOwnProperty.call(value, arrKey)) {
            const target = value[arrKey];
            result[key] = parseModelDataValue(target, result);
          }
        }
      }
      return value;
    }
  }
};

export const isModel = (model: any): model is Model => {
  if ("dataValues" in model) return true;
  return false;
};
