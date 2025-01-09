import TypeModel from "../../../dao/type/model/type.model";
import { FindIssueByPageQuery, SqlModelInstance } from "../../../types";
import { NotFoundError } from "../../../utils";
import issueModel from "../model/issue.model";
import IssueModel, { IssueAttributes } from "../model/issue.model";
import { Op } from "sequelize";

export interface FindIssueByPageSqlCondition {
  [Op.or]: {
    issueTitle?: {
      [Op.like]: RegExp;
    };
    typeId?: string;
    issueStatus?: boolean;
  };
}
// issue
export class IssueDAO {
  public static instance: IssueDAO = new IssueDAO();

  public static getInstance() {
    if (!IssueDAO.instance) IssueDAO.instance = new IssueDAO();
    return IssueDAO.instance;
  }

  public async findIssueByPage(pageInfo: FindIssueByPageQuery) {
    const {
      typeId,
      keyword = "",
      limit = 10,
      page = 1,
      issueStatus,
    } = pageInfo;

    const pageObj = {
      currentPage: Number(page),
      eachPage: Number(limit),
    };

    const queryConditionOr: FindIssueByPageSqlCondition[] = [];
    if (keyword) {
      // 用户要按照书籍标题进行搜索
      queryConditionOr[Op.or].push({
        issueTitle: {
          [Op.like]: new RegExp(keyword, "i"),
        },
      });
    }
    if (typeId) {
      // 用户要按照分类进行搜索
      queryConditionOr[Op.or].push({
        typeId,
      });
    }
    if (issueStatus != undefined) {
      queryConditionOr[Op.or].push({ issueStatus });
    }

    const count = await issueModel.count();
    const totalPage = Math.ceil(count / pageObj.eachPage);
    const data = await issueModel.findAndCountAll({
      where: queryConditionOr,
      order: ["issueDate", "DESC"],
      include: [
        {
          model: TypeModel,
          as: "typeName",
          where: {
            typeId,
          },
        },
      ],
      offset: (+page * 1 - 1) * +limit,
      limit: +limit,
    });
    return {
      ...pageObj,
      count,
      totalPage,
      data,
    };
  }

  public async findIssueById(id: string) {
    return issueModel.findOne({ where: { id } });
  }

  public async addIssue(issueInfo: IssueAttributes) {
    return issueModel.create(issueInfo);
  }

  public async deleteIssue(id: string) {
    return issueModel.findOne({ where: { id } });
  }

  public async updateIssue(id: string, issueInfo: IssueAttributes) {
    await issueModel.update(issueInfo, { where: { id } });
    return await this.findIssueById(id);
  }
}

const issueDAO = IssueDAO.getInstance();
export default issueDAO;
