import express, { Request } from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import blogService from "../../../service/blog.service";
import {
  CommonParams,
  CommonRequest,
  FindBlogByPageRequest,
} from "../../../types";
import { BlogAttributes } from "../../../dao/blog/model/blog.model";

const blogRouter = express.Router();

// 添加博客
blogRouter.post(
  "/",
  asyncHandler(async (req: CommonRequest<BlogAttributes>, res, next) => {
    return await blogService.addBlog(req.body);
  })
);

// 分页获取博客
blogRouter.get(
  "/",
  asyncHandler(async (req: FindBlogByPageRequest, res, next) => {
    return await blogService.findBlogByPage(req.query);
  })
);

// 获取其中一个博客
blogRouter.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    return await blogService.findBlogById(req.params.id, authorization);
  })
);

// 删除其中一个博客
blogRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await blogService.deleteBlog(req.params.id);
  })
);

// 修改其中一个博客
blogRouter.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await blogService.updateBlog(req.params.id, req.body);
  })
);

export default blogRouter;
