import express from "express";
import demoService from "../../../service/demo.service";
import { asyncHandler } from "../../../utils";
import messageService from "../../../service/message.service";
import { CommonRequest } from "../../../types";
import { MessageAttributes } from "../../../dao/message/model/message.model";

const messageRouter = express.Router();

// 获取留言或者评论
messageRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await demoService.findAllDemo();
  })
);

// 添加留言或者评论
messageRouter.post(
  "/",
  asyncHandler(async (req: CommonRequest<MessageAttributes>, res, next) => {
    return await messageService.addMessage(req.body);
  })
);

// 删除留言或者评论
messageRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await demoService.deleteDemo(req.params.id);
  })
);

export default messageRouter;
