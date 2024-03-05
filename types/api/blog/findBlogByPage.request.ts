import { CommonRequest } from "../common";

export interface FindBlogByPageQuery {
  /**
   * 分类id，默认-1
   */
  categoryId?: string;
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
  [property: string]: any;
}
export interface FindBlogByPageRequest extends CommonRequest {
  query: FindBlogByPageQuery;
}
