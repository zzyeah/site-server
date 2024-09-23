import { DataTypes } from "sequelize";
import sequelize from "../../dbConnect";
import { BlogAttributes, SqlModelInstance } from "../../../types";

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const BlogModel = sequelize.define<SqlModelInstance<BlogAttributes>>(
  "blog",
  {
    // 表的字段
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    toc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumb: {
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
    createDate: {
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

export default BlogModel;
