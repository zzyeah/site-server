import { log } from "console";
import BlogTypeModel, { BlogTypeAttributes } from "../model/blogType.model";

export class BlogTypeDAO {
  public static instance: BlogTypeDAO = new BlogTypeDAO();

  public static getInstance() {
    if (!BlogTypeDAO.instance) BlogTypeDAO.instance = new BlogTypeDAO();
    return BlogTypeDAO.instance;
  }

  // 添加博客类型
  async addBlogType(newBlogTypeInfo) {
    const { dataValues } = await BlogTypeModel.create(newBlogTypeInfo);
    return dataValues;
  }

  // 获取所有博客类型列表
  async findAllBlogType() {
    return await BlogTypeModel.findAll();
  }

  // 获取单个博客类型
  async findOneBlogType(id) {
    return await BlogTypeModel.findByPk(id);
  }

  // 更新单个博客类型
  async updateOneBlogType(id: string, blogTypeInfo: BlogTypeAttributes) {
    await BlogTypeModel.update(blogTypeInfo, {
      where: {
        id,
      },
    });
    return await this.findOneBlogType(id);
  }

  // 删除单个博客类型
  async deleteOneBlogType(id) {
    return await BlogTypeModel.destroy({
      where: {
        id,
      },
    });
  }
}

const blogTypeDAO = BlogTypeDAO.getInstance();
export default blogTypeDAO;
