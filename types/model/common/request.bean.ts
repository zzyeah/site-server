import { Request, Response, NextFunction } from "express";

export interface CommonRequestBody {}

export interface CommonRequestHeader {}

export interface CommonRequest<T extends CommonRequestBody> extends Request {
  body: T;
}
