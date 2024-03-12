import { TOC } from "../../../utils";
import { SqlBaseAttributes } from "..";
export interface BlogCommonInfo extends SqlBaseAttributes {
  title: string;
  description: string;
  htmlContent: string;
  thumb: string;
  scanNumber: number;
  commentNumber: number;
  createDate: string;
  categoryId?: number;
}
// 定义用户自定义属性接口
export interface BlogAttributes extends BlogCommonInfo {
  toc: string;
}

export interface Blog extends BlogCommonInfo {
  toc?: TOC[];
}
