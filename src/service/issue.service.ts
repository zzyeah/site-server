// issue 模块业务逻辑层

import { Constraints } from "../types";
import issueDAO from "../dao/issue/dao/issue.dao";
import validate from "validate.js";
import { ValidationError } from "../utils";
import { IssueAttributes } from "../dao/issue/model/issue.model";

class IssueService {
  public static instance: IssueService;

  public static getInstance() {
    if (!IssueService.instance) IssueService.instance = new IssueService();
    return IssueService.instance;
  }

  /**
   * 按分页查询问答
   */
  public async findIssueByPageService(queryObj) {
    return await issueDAO.findIssueByPage(queryObj);
  }

  /**
   * 根据 id 获取其中一个问答信息
   */
  public async findIssueByIdService(id) {
    return await issueDAO.findIssueById(id);
  }

  /**
   * 新增问答
   */
  public async addIssueService(newIssueInfo: IssueAttributes) {
    const issueRule: Constraints<IssueAttributes> = {
      issueTitle: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      issueContent: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      userId: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      typeId: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
    };

    // 首先进行同步的数据验证
    const validateResult = validate.validate(newIssueInfo, issueRule);
    if (!validateResult) {
      // 验证通过

      // 添加其他信息
      newIssueInfo.scanNumber = 0; // 浏览数，默认为 0
      newIssueInfo.commentNumber = 0; // 评论数，默认为 0
      // 上架日期
      newIssueInfo.issueDate = new Date().getTime().toString();

      // 添加状态，默认是未过审状态
      newIssueInfo.issueStatus = false;

      return await issueDAO.addIssue(newIssueInfo);
    } else {
      // 数据验证失败
      return new ValidationError("数据验证失败");
    }
  }

  /**
   * 删除某一个问答
   */
  public async deleteIssueService(id) {
    // 首先需要删除该问答对应的评论

    // 获取该 issueId 对应的所有评论
    // TODO:comment 模块未完成
    // const commentResult = await issueDAO.findIssueCommentById(id);

    // for (let i = 0; i < commentResult.length; i++) {
    //   await issueDAO.deleteComment(commentResult[i]._id);
    // }

    // 接下来再删除该问答
    return await issueDAO.deleteIssue(id);
  }

  /**
   * 修改某一个问答
   */
  public async updateIssueService(id, newInfo) {
    return await issueDAO.updateIssue(id, newInfo);
  }
}

const issueService = IssueService.getInstance();
export default issueService;
