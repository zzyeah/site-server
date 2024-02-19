import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";

// 定义用户自定义属性接口
export interface AdminAttributes extends SqlBaseAttributes {
  loginId: string;
  name: string;
  loginPwd: string;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const AdminModel = sequelize.define<SqlModelInstance<AdminAttributes>>(
  "admin",
  {
    // 表的字段
    loginId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loginPwd: {
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

export default AdminModel;
