import express from "express";
import { asyncHandler } from "../../../utils";
import { CommonRequest } from "../../../types";
import aboutService from "../../../service/about.service";
import { AboutAttributes } from "../../../dao/about/model/about.model";

const aboutRouter = express.Router();

// 获取留言或者评论
aboutRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await aboutService.findAbout();
  })
);

// 添加留言或者评论
aboutRouter.put(
  "/",
  asyncHandler(
    async (req: CommonRequest<Partial<AboutAttributes>>, res, next) => {
      return await aboutService.updateAbout(req.body);
    }
  )
);

export default aboutRouter;
