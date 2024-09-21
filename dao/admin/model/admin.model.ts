import { DataTypes } from "sequelize";
import sequelize from "../../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";
import { permission } from "process";

// 定义用户自定义属性接口
export interface AdminAttributes extends SqlBaseAttributes {
  loginId: string;
  name: string;
  loginPwd: string;
  avatar?: string;
  permission: number
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
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permission: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default AdminModel;
