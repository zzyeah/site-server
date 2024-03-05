import BlogTypeModel from "../blogType/model/blogType.model";
import BlogModel from "../blog/model/blog.model";

BlogTypeModel.hasMany(BlogModel, { foreignKey: "categoryId", sourceKey: "id" });
BlogModel.belongsTo(BlogTypeModel, {
  foreignKey: "categoryId",
  targetKey: "id",
  as: "category",
});
