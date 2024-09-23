import { CommonRequest } from "../common";

export interface FindMessageByPageInfo {
  page?: string;
  limit?: string;
  blogId?: string;
  keyword?: string;
  [property: string]: any;
}
export interface FindMessageByPageRequest extends CommonRequest {
  query: FindMessageByPageInfo;
}
