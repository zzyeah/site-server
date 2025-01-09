import { DataTypes } from "sequelize";
import { UserAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const UserModel = createDefaultModel<UserAttributes>(
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
