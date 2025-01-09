import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import UserModel from "../../../dao/user/model/user.model";
import TypeModel from "../../../dao/type/model/type.model";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义全局设置属性接口
export interface IssueAttributes extends SqlBaseAttributes {
  issueTitle: string; // 问题标题
  issueContent: string; // 问题描述
  issuePic: string; // 问题图片
  scanNumber: number; //	问题浏览量
  commentNumber: number; //	评论数
  issueStatus: boolean; //	问题状态
  issueDate: string; //	问题时间
  userId: string; //	用户 id
  typeId: string; //  所属分类
  [key: string]: any;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const IssueModel = createDefaultModel<IssueAttributes>(
  "issue",
  {
    // 表的字段
    issueTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issueContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issuePic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scanNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issueStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: UserModel,
        key: "id",
      },
      allowNull: false,
    },
    typeId: {
      type: DataTypes.STRING,
      references: {
        model: TypeModel,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default IssueModel;
