import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义评论属性接口
export interface MessageAttributes extends SqlBaseAttributes {
  nickname: string;
  content: string;
  createDate: number;
  avatar: string;
  blogId?: string | null;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const MessageModel = createDefaultModel<MessageAttributes>(
  "message",
  {
    // 表的字段
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createDate: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default MessageModel;
