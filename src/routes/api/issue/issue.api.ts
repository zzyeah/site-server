import express from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import { FindIssueByPageRequest } from "../../../types";
import issueService from "../../../service/issue.service";

const issueRouter = express.Router();

/**
 * 根据分页获取问答信息
 */
issueRouter.get(
  "/",
  asyncHandler(async function (req: FindIssueByPageRequest, res) {
    const result = await issueService.findIssueByPageService(req.query);
    return result;
  })
);

/**
 * 根据 id 获取其中一个问答具体信息
 */
issueRouter.get(
  "/:id",
  asyncHandler(async function (req, res) {
    const result = await issueService.findIssueByIdService(req.params.id);
    return result;
  })
);

/**
 * 新增问答
 */
issueRouter.post(
  "/",
  asyncHandler(async function (req, res, next) {
    const result = await issueService.addIssueService(req.body);
    return result;
  })
);

/**
 * 根据 id 删除某一个问答
 */
issueRouter.delete(
  "/:id",
  asyncHandler(async function (req, res) {
    const result = await issueService.deleteIssueService(req.params.id);
    return result;
  })
);

/**
 * 根据 id 修改某一个问答
 */
issueRouter.patch(
  "/:id",
  asyncHandler(async function (req, res) {
    const result = await issueService.updateIssueService(
      req.params.id,
      req.body
    );
    return result;
  })
);

export default issueRouter;
