import { FindBlogByPageQuery } from "../../../types";
import BlogTypeModel from "../../blogType/model/blogType.model";
import BlogModel, { BlogAttributes } from "../model/blog.model";

export class BlogDAO {
  public static instance: BlogDAO = new BlogDAO();

  public static getInstance() {
    if (!BlogDAO.instance) BlogDAO.instance = new BlogDAO();
    return BlogDAO.instance;
  }

  // 添加博客
  async addBlog(newBlogInfo: BlogAttributes) {
    const { dataValues } = await BlogModel.create(newBlogInfo);
    return dataValues;
  }

  // 根据分页信息查询博客
  async findBlogByPage(pageInfo: FindBlogByPageQuery) {
    const { categoryId = -1, keyword = "", limit = 10, page = 1 } = pageInfo;
    if (categoryId && +categoryId !== -1) {
      // 根据分类信息来进行分页查询
      return await BlogModel.findAndCountAll({
        include: [
          {
            model: BlogTypeModel,
            as: "category",
            where: {
              id: categoryId,
            },
          },
        ],
        offset: (+page * 1 - 1) * +limit,
        limit: +limit,
      });
    } else {
      // 根据所有博客文章进行分页查询
      return await BlogModel.findAndCountAll({
        include: [
          {
            model: BlogTypeModel,
            as: "category",
          },
        ],
        offset: (+page * 1 - 1) * +limit,
        limit: +limit,
      });
    }
  }

  // 根据博客id查询博客信息
  async findBlogById(id: string) {
    return await BlogModel.findByPk(id, {
      include: [
        {
          model: BlogTypeModel,
          as: "category",
        },
      ],
    });
  }

  // 更新博客文章
  async updateBlog(id: string, newBlogInfo: BlogAttributes) {
    await BlogModel.update(newBlogInfo, {
      where: {
        id,
      },
    });
    return await this.findBlogById(id);
  }

  async deleteBlog(id: string) {
    return await BlogModel.destroy({
      where: {
        id,
      },
    });
  }

}

const blogDAO = BlogDAO.getInstance();
export default blogDAO;
