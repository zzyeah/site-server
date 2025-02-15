import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../common/common.model";
import TypeModel from "../../type/model/type.model";

// 定义用户自定义属性接口
export interface InterviewAttributes extends SqlBaseAttributes {
  interviewTitle: string; // 面试题标题
  interviewContent: string; // 面试题内容
  onShelfDate: string; // 上架日期
  typeId: string; //  所属分类
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const InterviewModel = createDefaultModel<InterviewAttributes>(
  "interview",
  {
    // 表的字段
    interviewTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interviewContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    onShelfDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        key: "id",
        model: TypeModel,
      },
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default InterviewModel;
