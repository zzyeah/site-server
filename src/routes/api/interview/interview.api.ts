import express from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import interviewService from "../../../service/interview.service";
import { FindInterviewByPageRequest } from "../../../types/api/interview/findInterviewByPage.request";

const interviewRouter = express.Router();

/**
 * 根据分页获取面试题
 */
interviewRouter.get(
  "/",
  asyncHandler(async function (req: FindInterviewByPageRequest, res) {
    return await interviewService.findInterviewByPage(req.query);
  })
);

/**
 * 获取所有分类的面试题标题
 */
interviewRouter.get(
  "/interviewTitle",
  asyncHandler(async function (req, res) {
    return await interviewService.findInterviewTitleByType();
  })
);

/**
 * 根据 id 获取面试题
 */
interviewRouter.get(
  "/:id",
  asyncHandler(async function (req, res) {
    return await interviewService.findInterviewById(req.params.id);
  })
);

/**
 * 新增面试题
 */
interviewRouter.post(
  "/",
  asyncHandler(async function (req, res, next) {
    return await interviewService.addInterview(req.body);
  })
);

/**
 * 删除面试题
 */
interviewRouter.delete(
  "/:id",
  asyncHandler(async function (req, res) {
    return await interviewService.deleteInterview(req.params.id);
  })
);

/**
 * 修改面试题
 */
interviewRouter.patch(
  "/:id",
  asyncHandler(async function (req, res) {
    return await interviewService.updateInterview(req.params.id, req.body);
  })
);

export default interviewRouter;
