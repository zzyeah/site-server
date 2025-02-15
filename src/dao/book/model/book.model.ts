import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../common/common.model";
import TypeModel from "../../../dao/type/model/type.model";

// 定义用户自定义属性接口
export interface BookAttributes extends SqlBaseAttributes {
  bookTitle: string; // 书籍标题
  bookPic: string; // 书籍图片
  downloadLink: string; // 下载链接
  bookIntro: string; // 书籍介绍
  scanNumber: number; // 浏览数
  commentNumber: number; // 评论数
  onShelfDate: string; // 上架日期
  requirePoints: number; // 下砸所需积分
  typeId: string; //  所属分类
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const BookModel = createDefaultModel<BookAttributes>(
  "book",
  {
    // 表的字段
    bookTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookPic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    downloadLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookIntro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    onShelfDate: {
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
    requirePoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        key: "id",
        model: TypeModel,
      },
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

export default BookModel;
