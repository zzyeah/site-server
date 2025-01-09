import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../../dao/common/common.model";

// 定义全局设置属性接口
export interface SettingAttributes extends SqlBaseAttributes {
  avatar: string;
  favicon: string;
  github: string;
  githubName: string;
  icp: string; // 备案号
  mail: string;
  qq: string;
  qqQrCode: string;
  siteTitle: string;
  weixin: string;
  weixinQrCode: string;
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const SettingModel = createDefaultModel<SettingAttributes>(
  "setting",
  {
    // 表的字段
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    siteTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qq: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qqQrCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weixin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weixinQrCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    githubName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favicon: {
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

export default SettingModel;
