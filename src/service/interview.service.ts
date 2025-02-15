import { ValidationError } from "../utils/errors";
import { Constraints } from "../types/validatejs/validate-rule.bean";
import validate from "validate.js";
import interviewDAO from "../dao/interview/dao/interview.dao";
import { InterviewAttributes } from "../dao/interview/model/interview.model";
import { FindInterviewByPageQuery } from "../types/api/interview/findInterviewByPage.request";

class InterviewService {
  public static instance: InterviewService;

  public static getInstance() {
    if (!InterviewService.instance)
      InterviewService.instance = new InterviewService();
    return InterviewService.instance;
  }

  /**
   * 按照分页查询面试题
   */
  async findInterviewByPage(queryObj: FindInterviewByPageQuery) {
    return await interviewDAO.findInterviewByPage(queryObj);
  }

  /**
   * 获取所有分类的面试题标题
   */
  async findInterviewTitleByType() {
    return await interviewDAO.findInterviewTitleByType();
  }

  /**
   * 根据 id 查找某一道面试题
   */
  async findInterviewById(id: string) {
    return await interviewDAO.findInterviewById(id);
  }

  /**
   * 新增面试题
   */
  async addInterview(newInterviewInfo: InterviewAttributes) {
    // 首先进行同步的数据验证
    const interviewRule: Constraints<InterviewAttributes> = {
      interviewTitle: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      interviewContent: {
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
    const validateResult = validate.validate(newInterviewInfo, interviewRule);
    if (!validateResult) {
      // 上架日期
      newInterviewInfo.onShelfDate = new Date().getTime().toString();
      // 验证通过
      return await interviewDAO.addInterview(newInterviewInfo);
    } else {
      // 数据验证失败
      return new ValidationError("数据验证失败");
    }
  }

  /**
   * 删除面试题
   */
  async deleteInterview(id: string) {
    // 接下来再删除该书籍
    return await interviewDAO.deleteInterview(id);
  }

  /**
   * 修改面试题
   */
  async updateInterview(id: string, newInfo: InterviewAttributes) {
    return await interviewDAO.updateInterview(id, newInfo);
  }
}

const interviewService = InterviewService.getInstance();
export default interviewService;
