import { CommonRequest } from "..";
import { Blog } from "../../model/blog/blog.bean";

export interface AddBlogRequest extends CommonRequest {
  body: Blog;
}
