import { CommonRequest } from "./request.bean";

export interface QueryByPageParams {
  /**
   * 分类id，默认-1
   */
  typeId?: string;
  /**
   * 查询关键字，默认空字符串
   */
  keyword?: string;
  /**
   * 页容量，默认10
   */
  limit?: string;
  /**
   * 页码，默认1
   */
  page?: string;
  /**
   * 其他参数
   */
  [property: string]: any;
}

export interface QueryByPageParamsRequest<T extends QueryByPageParams>
  extends CommonRequest {
  query: T;
}
