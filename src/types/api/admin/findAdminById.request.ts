import { CommonRequest } from "../common";

export interface FindAdminByIdRequest extends CommonRequest {
    params: {
      id: string;
    };
  }
  