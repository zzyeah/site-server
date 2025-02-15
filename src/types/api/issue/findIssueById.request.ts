import { CommonRequest } from "../common";

export interface FindIssueByIdRequest extends CommonRequest {
  params: {
    id: string;
  };
}
