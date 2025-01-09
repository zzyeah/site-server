import { CommonRequest, QueryByPageParams } from "../common";

export interface FindIssueByPageQuery extends QueryByPageParams {
    issueStatus: boolean
}
export interface FindIssueByPageRequest extends CommonRequest {
  query: FindIssueByPageQuery;
}
