import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义关于接口
export interface AboutAttributes extends SqlBaseAttributes {
  url: string;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const AboutModel = createDefaultModel<AboutAttributes>(
  "about",
  {
    // 表的字段
    url: {
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

export default AboutModel;
