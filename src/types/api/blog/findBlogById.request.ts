import { CommonRequest } from "../common";

export interface FindBlogByIdRequest extends CommonRequest {
  params: {
    id: string;
  };
}
