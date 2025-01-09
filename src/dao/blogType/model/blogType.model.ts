import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义用户自定义属性接口
export interface BlogTypeAttributes extends SqlBaseAttributes {
  name: string;
  articleCount: number;
  order: number;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const BlogTypeModel = createDefaultModel<BlogTypeAttributes>(
  "blogType",
  {
    // 表的字段
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default BlogTypeModel;
