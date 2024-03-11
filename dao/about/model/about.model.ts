import { DataTypes } from "sequelize";
import sequelize from "../../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";

// 定义关于接口
export interface AboutAttributes extends SqlBaseAttributes {
  url: string;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const AboutModel = sequelize.define<SqlModelInstance<AboutAttributes>>(
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
