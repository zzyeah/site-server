import { RequestHandler } from "express";

export const getResult = function (result) {
  return {
    code: 0,
    msg: "",
    data: result,
  };
};

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      res.send(getResult(result));
    } catch (error) {
      next(error);
    }
  };
};
