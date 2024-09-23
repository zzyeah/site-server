import express from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import blogTypeService from "../../../service/blogType.service";

const blogTypeRouter = express.Router();

// 添加博客分类
blogTypeRouter.post(
  "/",
  asyncHandler(async (req, res, next) => {
    return await blogTypeService.addBlogType(req.body);
  })
);

// 获取博客分类列表
blogTypeRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await blogTypeService.findAllBlogType();
  })
);

// 获取其中一个博客分类
blogTypeRouter.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await blogTypeService.findOneBlogType(req.params.id);
  })
);

// 删除博客分类
blogTypeRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await blogTypeService.deleteOneBlogType(req.params.id);
  })
);

// 修改博客分类
blogTypeRouter.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await blogTypeService.updateOneBlogType(req.params.id, req.body);
  })
);

export default blogTypeRouter;
