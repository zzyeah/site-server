import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义用户自定义属性接口
export interface AdminAttributes extends SqlBaseAttributes {
  loginId: string;
  name: string;
  loginPwd: string;
  avatar?: string;
  permission: number;
  enabled?: number;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const AdminModel = createDefaultModel<AdminAttributes>(
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
      allowNull: true,
    },
    permission: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

export default AdminModel;
