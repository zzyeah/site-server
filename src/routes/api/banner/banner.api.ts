import { Router } from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import bannerService from "../../../service/banner.service";
import { CommonRequest } from "../../../types";
import { BannerAttributes } from "../../../dao/banner/model/banner.model";

const bannerRouter = Router();

// 获取首页标语
bannerRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await bannerService.findBanner();
  })
);

// 设置首页标语
bannerRouter.post(
  "/",
  asyncHandler(async (req: CommonRequest<BannerAttributes[]>, res, next) => {
    return await bannerService.updateBanner(req.body);
  })
);

export default bannerRouter;
