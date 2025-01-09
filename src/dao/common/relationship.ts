import BlogTypeModel from "../blogType/model/blogType.model";
import BlogModel from "../blog/model/blog.model";
import "../demo/model/demo.model";
import MessageModel from "../message/model/message.model";
import IssueModel from "../issue/model/issue.model";
import UserModel from "../user/model/user.model";
import TypeModel from "../type/model/type.model";

BlogModel.belongsTo(BlogTypeModel, {
  foreignKey: "categoryId",
  targetKey: "id",
  as: "category",
});

BlogTypeModel.hasMany(BlogModel, { foreignKey: "categoryId", sourceKey: "id" });

MessageModel.belongsTo(BlogModel, {
  foreignKey: "blogId",
  targetKey: "id",
  as: "blog",
});

BlogModel.hasMany(MessageModel, {
  foreignKey: "blogId",
  sourceKey: "id",
});

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
