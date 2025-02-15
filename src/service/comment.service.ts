import { FindCommentByPageAndTypeQuery } from "../types/api/comment/findCommentByPageAndType.request";
import commentDao from "../dao/comment/dao/comment.dao";
import { CommentAttributes } from "../dao/comment/model/comment.model";
import { Constraints, QueryByPageParams } from "../types";
import { ValidationError } from "../utils/errors";
import validate from "validate.js";

class CommentService {
  public static instance: CommentService;

  public static getInstance() {
    if (!CommentService.instance)
      CommentService.instance = new CommentService();
    return CommentService.instance;
  }

  /**
   * 根据分页查找对应模块评论
   */
  async findCommentByPageAndType(
    commentType: string,
    pageInfo: FindCommentByPageAndTypeQuery
  ) {
    return await commentDao.findCommentByPageAndType(commentType, pageInfo);
  }

  /**
   * 按照分页获取问答模块某一问题对应的评论
   */
  async findIssueCommentById(id: string, pageInfo: QueryByPageParams) {
    return await commentDao.findIssueCommentById(id, pageInfo);
  }

  /**
   * 按照分页获取书籍模块某一本书对应的评论
   */
  async findBookCommentById(id: string, pageInfo?: QueryByPageParams) {
    return await commentDao.findBookCommentById(id, pageInfo);
  }

  /**
   * 新增评论
   * @param {*} newCommentInfo
   * @returns
   */
  async addComment(newCommentInfo: CommentAttributes) {
    // 首先对数据进行一个处理，补全另一个 id 值为 null
    if (!newCommentInfo.issueId) {
      newCommentInfo.issueId = "";
    } else {
      newCommentInfo.bookId = "";
    }
    const commentRule: Constraints<CommentAttributes> = {
      userId: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      issueId: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      bookId: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      typeId: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      commentContent: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      commentType: {
        presence: {
          allowEmpty: false,
        },
        type: "number",
      },
    };
    try {
      await validate.async(newCommentInfo, commentRule);
      // 增加评论日期字段
      newCommentInfo.commentDate = new Date().getTime().toString();
      return await commentDao.addComment(newCommentInfo);
    } catch (error) {
      console.log(error);
      return new ValidationError("数据验证失败");
    }
  }

  /**
   * 根据 id 删除评论
   * @param {*} id
   * @returns
   */
  async deleteComment(id: string) {
    return await commentDao.deleteComment(id);
  }
}

const commentService = CommentService.getInstance();
export default commentService;
