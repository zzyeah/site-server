import { InterviewAttributes } from "../model/interview.model";
import typeDAO from "../../../dao/type/dao/type.dao";
import interviewModel from "../model/interview.model";
import { FindInterviewByPageQuery } from "../../../types/api/interview/findInterviewByPage.request";
import { WhereOptions, Op } from "sequelize";

export class InterviewDAO {
  public static instance: InterviewDAO = new InterviewDAO();

  public static getInstance() {
    if (!InterviewDAO.instance) InterviewDAO.instance = new InterviewDAO();
    return InterviewDAO.instance;
  }

  /**
   * 分页查找面试题
   */
  async findInterviewByPage(queryObj: FindInterviewByPageQuery) {
    const { typeId, limit = 10, page = 1, interviewTitle } = queryObj;

    const pageObj = {
      page: Number(page),
      limit: Number(limit),
    };
    const where: WhereOptions<InterviewAttributes> = {
      [Op.and]: {},
    };
    if (interviewTitle) {
      // 用户要按照书籍标题进行搜索
      where[Op.and] = {
        ...where[Op.and],
        interviewTitle: {
          [Op.like]: `%${interviewTitle}`,
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

    const count = await interviewModel.count({ where }); // 数据总条数
    const totalPage = Math.ceil(count / pageObj.limit); // 总页数
    const data = await interviewModel.findAll({
      where,
      order: [["onShelfDate", "DESC"]],
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

  /**
   * 获取所有分类的面试题标题
   */
  async findInterviewTitleByType() {
    // 1. 获取所有分类
    const typeData = await typeDAO.findAllType();

    const interviewTitleData: InterviewAttributes[][] = [];
    for (let i = 0; i < typeData.length; i++) {
      // 查询对应 typeId 的面试题，只需要题目即可
      // 因此后面添加了 { interviewTitle: 1 }
      const data = await interviewModel.findAll({
        where: { typeId: typeData[i].dataValues.id },
        attributes: ["id", "interviewTitle"],
      });
      interviewTitleData.push(data.map(({ dataValues }) => dataValues));
    }
    return interviewTitleData;
  }

  /**
   * 根据 id 返回面试题
   */
  async findInterviewById(id: string) {
    return interviewModel.findOne({
      where: { id },
      attributes: { exclude: ["onShelfDate", "typeId"] },
    });
  }

  /**
   * 新增面试题
   */
  async addInterview(newInterviewInfo: InterviewAttributes) {
    return await interviewModel.create(newInterviewInfo);
  }

  /**
   * 根据 id 删除面试题
   */
  async deleteInterview(id: string) {
    return interviewModel.destroy({
      where: { id },
    });
  }

  /**
   * 根据 id 修改面试题
   */
  async updateInterview(id: string, newInfo: InterviewAttributes) {
    return interviewModel.update(newInfo, { where: { id } });
  }
}

const interviewDAO = InterviewDAO.getInstance();
export default interviewDAO;
