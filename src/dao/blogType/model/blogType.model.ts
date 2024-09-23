import { DataTypes } from "sequelize";
import sequelize from "../../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";

// 定义用户自定义属性接口
export interface BlogTypeAttributes extends SqlBaseAttributes {
  name: string;
  articleCount: number;
  order: number;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const BlogTypeModel = sequelize.define<SqlModelInstance<BlogTypeAttributes>>(
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
