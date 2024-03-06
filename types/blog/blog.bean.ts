import { BlogCommonInfo } from "dao/blog/model/blog.model";
import { TOC } from "utils/tools";

export interface Blog extends BlogCommonInfo {
  toc?: TOC[];
  markdownContent?: string;
}
