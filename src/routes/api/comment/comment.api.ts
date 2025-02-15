import express from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import commentService from "../../../service/comment.service";
import { FindCommentByPageAndTypeRequest } from "src/types/api/comment/findCommentByPageAndType.request";
import { QueryByPageParams } from "src/types/api/common/queryByPage.bean";

const commentRouter = express.Router();

/**
 * 按照分页查询对应模块的评论
 */
commentRouter.get(
  "/:commentType",
  asyncHandler(async function (req: FindCommentByPageAndTypeRequest, res) {
    return await commentService.findCommentByPageAndType(
      req.params.commentType,
      req.query
    );
    // 对返回数据进行格式化
  })
);

/**
 * 按照分页获取问答模块某一问题对应的评论
 */
commentRouter.get(
  "/issuecomment/:id",
  asyncHandler(async function (req: QueryByPageParams, res) {
    return await commentService.findIssueCommentById(req.params.id, req.query);
  })
);

/**
 * 按照分页获取书籍模块某一本书对应的评论
 */
commentRouter.get(
  "/bookcomment/:id",
  asyncHandler(async function (req, res) {
    return await commentService.findBookCommentById(req.params.id, req.query);
  })
);

/**
 * 新增评论
 */
commentRouter.post(
  "/",
  asyncHandler(async function (req, res, next) {
    return await commentService.addComment(req.body);
  })
);

/**
 * 根据 id 删除评论
 */
commentRouter.delete(
  "/:id",
  asyncHandler(async function (req, res) {
    return await commentService.deleteComment(req.params.id);
  })
);
export default commentRouter;
