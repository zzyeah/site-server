import { DataTypes } from "sequelize";
import { SqlBaseAttributes } from "../../../types";
import { createDefaultModel } from "../../common/common.model";
import UserModel from "../../../dao/user/model/user.model";
import IssueModel from "../../../dao/issue/model/issue.model";
import TypeModel from "../../../dao/type/model/type.model";
import BookModel from "../../../dao/book/model/book.model";

// 定义用户自定义属性接口
export interface CommentAttributes extends SqlBaseAttributes {
  userId: string;
  issueId: string;
  bookId: string;
  typeId: string;
  commentContent: string; // 对应评论
  commentDate: string; // 评论日期
  commentType: number; // 评论类型
}

// 创建一个类型声明，将sequelize.define的结果转换为静态类类型
const CommentModel = createDefaultModel<CommentAttributes>(
  "comment",
  {
    // 表的字段
    bookId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        key: "id",
        model: BookModel,
      },
    },
    issueId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        key: "id",
        model: IssueModel,
      },
    },
    typeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        key: "id",
        model: TypeModel,
      },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        key: "id",
        model: UserModel,
      },
    },
    commentContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commentType: {
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

export default CommentModel;
