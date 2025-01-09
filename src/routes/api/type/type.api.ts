import express from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import typeService from "../../../service/type.service";

const typeRouter = express.Router();

/**
 * 查找所有类型
 */
typeRouter.get(
  "/",
  asyncHandler(async function (req, res) {
    return await typeService.findAllType();
  })
);

/**
 * 新增类型
 */
typeRouter.post(
  "/",
  asyncHandler(async function (req, res, next) {
    return await typeService.addType(req.body);
  })
);

/**
 * 根据 id 删除类型
 */
typeRouter.delete(
  "/:id",
  asyncHandler(async function (req, res) {
    return await typeService.deleteType(req.params.id);
  })
);

/**
 * 根据 id 修改类型
 */
typeRouter.patch(
  "/:id",
  asyncHandler(async function (req, res) {
    return await typeService.updateType(req.params.id, req.body);
  })
);

export default typeRouter;
