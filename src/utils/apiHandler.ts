import { RequestHandler } from "express";

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
