import {
  CommonRequest,
  QueryByPageParams,
  QueryByPageParamsRequest,
} from "../common";

export interface FindBookByPageQuery extends QueryByPageParams {
  bookTitle: string;
}
export type FindBookByPageRequest =
  QueryByPageParamsRequest<FindBookByPageQuery>;
