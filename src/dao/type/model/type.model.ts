import { DataTypes } from "sequelize";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义用户自定义属性接口
export interface TypeAttributes extends SqlBaseAttributes {
  typeName: string;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const TypeModel = createDefaultModel<TypeAttributes>(
  "type",
  {
    // 表的字段
    typeName: {
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

export default TypeModel;
