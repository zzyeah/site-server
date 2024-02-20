import { DataTypes } from "sequelize";
import sequelize from "../../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";

// 定义用户自定义属性接口
export interface BannerAttributes extends SqlBaseAttributes {
  midImg: string;
  bigImg: string;
  title: string;
  description: string;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const BannerModel = sequelize.define<SqlModelInstance<BannerAttributes>>(
  "banner",
  {
    // 表的字段
    midImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bigImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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

export default BannerModel;
