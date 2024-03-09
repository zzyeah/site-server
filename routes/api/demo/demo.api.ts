import express from "express";
import demoService from "../../../service/demo.service";
import { asyncHandler } from "../../../utils";

const demoRouter = express.Router();

// 获取项目
demoRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await demoService.findAllDemo();
  })
);

// 新增项目
demoRouter.post(
  "/",
  asyncHandler(async (req, res, next) => {
    return await demoService.addDemo(req.body);
  })
);

// 修改项目
demoRouter.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await demoService.updateDemo(req.params.id, req.body);
  })
);

// 删除项目
demoRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await demoService.deleteDemo(req.params.id);
  })
);

export default demoRouter;
