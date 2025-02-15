import { QueryByPageParams, QueryByPageParamsRequest } from "../common";

export interface FindBlogByPageQuery extends QueryByPageParams {}

export type FindBlogByPageRequest =
  QueryByPageParamsRequest<FindBlogByPageQuery>;
