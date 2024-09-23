import { Request, Response, NextFunction } from "express";

export interface CommonRequestBody {}

export interface CommonRequestHeader {}

export interface CommonParams {
  [key: string]: string;
}
export interface CommonQuery {
  [key: string]: undefined | string | string[] | CommonQuery | CommonQuery[];
}
export interface CommonRequest<
  T extends CommonRequestBody = CommonRequestBody,
  Q extends CommonQuery = CommonQuery,
  P extends CommonParams = CommonParams
> extends Request {
  body: T;
  params: P;
  query: Q;
}
