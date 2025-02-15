import BlogTypeModel from "../blogType/model/blogType.model";
import BlogModel from "../blog/model/blog.model";
import "../demo/model/demo.model";
import MessageModel from "../message/model/message.model";
import IssueModel from "../issue/model/issue.model";
import UserModel from "../user/model/user.model";
import TypeModel from "../type/model/type.model";
import CommentModel from "../comment/model/comment.model";
import BookModel from "../book/model/book.model";
import InterviewModel from "../interview/model/interview.model";

// ----------------------- BlogTypes --------------------------------

BlogModel.belongsTo(BlogTypeModel, {
  foreignKey: "categoryId",
  targetKey: "id",
  as: "category",
});

BlogTypeModel.hasMany(BlogModel, { foreignKey: "categoryId", sourceKey: "id" });

// ------------------------ Messages --------------------------------

MessageModel.belongsTo(BlogModel, {
  foreignKey: "blogId",
  targetKey: "id",
  as: "blog",
});

BlogModel.hasMany(MessageModel, {
  foreignKey: "blogId",
  sourceKey: "id",
});

// ---------------------------- Issues ----------------------------

IssueModel.belongsTo(UserModel, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});
UserModel.hasMany(IssueModel, {
  foreignKey: "userId",
  sourceKey: "id",
});
IssueModel.belongsTo(TypeModel, {
  foreignKey: "typeId",
  targetKey: "id",
  as: "type",
});
TypeModel.hasMany(IssueModel, {
  foreignKey: "typeId",
  sourceKey: "id",
});

// ------------------------  Comments --------------------------

CommentModel.belongsTo(BookModel, {
  foreignKey: "bookId",
  targetKey: "id",
  as: "book",
});
BookModel.hasMany(CommentModel, {
  foreignKey: "bookId",
  sourceKey: "id",
});

CommentModel.belongsTo(IssueModel, {
  foreignKey: "issueId",
  targetKey: "id",
  as: "issue",
});
IssueModel.hasMany(CommentModel, {
  foreignKey: "issueId",
  sourceKey: "id",
});

CommentModel.belongsTo(TypeModel, {
  foreignKey: "typeId",
  targetKey: "id",
  as: "type",
});
TypeModel.hasMany(CommentModel, {
  foreignKey: "typeId",
  sourceKey: "id",
});

CommentModel.belongsTo(UserModel, {
  foreignKey: "userId",
  targetKey: "id",
  as: "user",
});
UserModel.hasMany(CommentModel, {
  foreignKey: "userId",
  sourceKey: "id",
});

// -----------------------  Books --------------------------

BookModel.belongsTo(TypeModel, {
  foreignKey: "typeId",
  targetKey: "id",
  as: "type",
});
TypeModel.hasMany(BookModel, {
  foreignKey: "typeId",
  sourceKey: "id",
});

// -------------------------- Interviews -------------------------

InterviewModel.belongsTo(TypeModel, {
  foreignKey: "typeId",
  targetKey: "id",
  as: "type",
});
TypeModel.hasMany(InterviewModel, {
  foreignKey: "typeId",
  sourceKey: "id",
});
