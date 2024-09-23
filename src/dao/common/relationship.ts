import BlogTypeModel from "../blogType/model/blogType.model";
import BlogModel from "../blog/model/blog.model";
import "../demo/model/demo.model";
import MessageModel from "../message/model/message.model";

BlogTypeModel.hasMany(BlogModel, { foreignKey: "categoryId", sourceKey: "id" });
BlogModel.belongsTo(BlogTypeModel, {
  foreignKey: "categoryId",
  targetKey: "id",
  as: "category",
});

BlogModel.hasMany(MessageModel, {
  foreignKey: "blogId",
  sourceKey: "id",
});

MessageModel.belongsTo(BlogModel, {
  foreignKey: "blogId",
  targetKey: "id",
  as: "blog",
});
