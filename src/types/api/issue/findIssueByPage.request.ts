import {
  CommonRequest,
  QueryByPageParams,
  QueryByPageParamsRequest,
} from "../common";

export interface FindIssueByPageQuery extends QueryByPageParams {
  issueStatus: string; // boolean
}
export type FindIssueByPageRequest =
  QueryByPageParamsRequest<FindIssueByPageQuery>;
