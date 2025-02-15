import UserModel from "../../../dao/user/model/user.model";
import TypeModel from "../../../dao/type/model/type.model";
import { FindIssueByPageQuery } from "../../../types";
import issueModel from "../model/issue.model";
import { IssueAttributes } from "../model/issue.model";
import { Op, WhereOptions } from "sequelize";

export interface FindIssueByPageSqlCondition {
  issueTitle?: {
    [Op.like]: string;
  };
  typeId?: string;
  issueStatus?: boolean;
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
      page: Number(page),
      limit: Number(limit),
    };
    const where: WhereOptions<IssueAttributes> = {
      [Op.and]: {},
    };
    if (keyword) {
      // 用户要按照书籍标题进行搜索
      where[Op.and] = {
        ...where[Op.and],
        issueTitle: {
          [Op.like]: `%${keyword}%`,
        },
      };
    }
    if (typeId) {
      // 用户要按照分类进行搜索
      where[Op.and] = {
        ...where[Op.and],
        typeId,
      };
    }
    if (issueStatus != undefined) {
      where[Op.and] = {
        ...where[Op.and],
        issueStatus: Boolean(issueStatus),
      };
    }
    let count;
    try {
       count = await issueModel.count({ where });

    } catch (error) {
      console.log(error);
            
    }
    const totalPage = Math.ceil(count / pageObj.limit);
    const data = await issueModel.findAll({
      where,
      order: [["issueDate", "DESC"]],
      include: [
        {
          model: TypeModel,
          as: "type",
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
    return issueModel.findOne({
      where: { id },
      include: [
        { model: UserModel, as: "user", attributes: { exclude: ["loginPwd"] } },
      ],
    });
  }

  public async addIssue(issueInfo: IssueAttributes) {
    return issueModel.create(issueInfo);
  }

  public async deleteIssue(id: string) {
    return issueModel.destroy({ where: { id } });
  }

  public async updateIssue(id: string, issueInfo: IssueAttributes) {
    await issueModel.update(issueInfo, { where: { id } });
    return await this.findIssueById(id);
  }
}

const issueDAO = IssueDAO.getInstance();
export default issueDAO;
