import { QueryByPageParams, QueryByPageParamsRequest } from "../common";

export interface FindCommentByPageAndTypeQuery extends QueryByPageParams {
  commentContent: string;
}
export type FindCommentByPageAndTypeRequest =
  QueryByPageParamsRequest<FindCommentByPageAndTypeQuery>;
