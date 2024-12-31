import { DataTypes } from "sequelize";
import sequelize from "../../dbConnect";
import { SqlBaseAttributes, SqlModelInstance } from "../../../types";

// 定义用户自定义属性接口
export interface UserAttributes extends SqlBaseAttributes {
  loginId: string;
  name: string;
  loginPwd: string;
  avatar?: string;
  permission?: number; // 暂时不需要权限
  enabled?: number;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const UserModel = sequelize.define<SqlModelInstance<UserAttributes>>(
  "user",
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
      allowNull: true,
    },
    permission: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default UserModel;
