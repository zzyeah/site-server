import express from "express";
import { asyncHandler } from "../../../utils";
import { CommonRequest } from "../../../types";
import settingService from "../../../service/setting.service";
import { SettingAttributes } from "../../../dao/setting/model/setting.model";

const settingRouter = express.Router();

// 获取留言或者评论
settingRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await settingService.findSetting();
  })
);

// 添加留言或者评论
settingRouter.put(
  "/",
  asyncHandler(
    async (req: CommonRequest<Partial<SettingAttributes>>, res, next) => {
      return await settingService.updateSetting(req.body);
    }
  )
);

export default settingRouter;
