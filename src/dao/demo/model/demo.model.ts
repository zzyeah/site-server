import { DataTypes } from "sequelize";
import { DemoAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const DemoModel = createDefaultModel<DemoAttributes>(
  "demo",
  {
    // 表的字段
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumb: {
      type: DataTypes.STRING,
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

export default DemoModel;
