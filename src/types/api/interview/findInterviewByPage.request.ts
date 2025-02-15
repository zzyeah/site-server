import {
  CommonRequest,
  QueryByPageParams,
  QueryByPageParamsRequest,
} from "../common";

export interface FindInterviewByPageQuery extends QueryByPageParams {
  interviewTitle: string;
}
export type FindInterviewByPageRequest =
  QueryByPageParamsRequest<FindInterviewByPageQuery>;
