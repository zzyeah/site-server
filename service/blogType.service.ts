// banner 模块业务逻辑层

import validate from "validate.js";
import { Constraints } from "../types";
import { ValidationError } from "../utils/errors";
import blogTypeDAO from "../dao/blog/dao/blogType.dao";
import { BlogTypeAttributes } from "../dao/blog/model/blogType.model";

class BlogTypeService {
  public static instance: BlogTypeService;

  public static getInstance() {
    if (!BlogTypeService.instance)
      BlogTypeService.instance = new BlogTypeService();
    return BlogTypeService.instance;
  }

  // 新增博客分类
  async addBlogType(newBlogTypeInfo: any) {
    // 数据验证规则
    const blogTypeRules: Constraints = {
      name: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      order: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
    };

    // 进行数据验证
    const validateResult = validate(newBlogTypeInfo, blogTypeRules);
    if (!validateResult) {
      newBlogTypeInfo.articleCount = 0;
      return await blogTypeDAO.addBlogType(newBlogTypeInfo);
    } else {
      throw new ValidationError("数据验证失败");
    }
  }

  // 查询所有博客分类
  async findAllBlogType() {
    const result = await blogTypeDAO.findAllBlogType();
    result.sort((a, b) => a.dataValues.order - b.dataValues.order);
    return result;
  }

  // 获取单个博客分类
  async findOneBlogType(id: string) {
    return await blogTypeDAO.findOneBlogType(id);
  }

  // 修改单个博客分类
  async updateOneBlogType(id: string, blogType: BlogTypeAttributes) {
    return await blogTypeDAO.updateOneBlogType(id, blogType);
  }

  // 删除单个博客分类
  async deleteOneBlogType(id: string) {
    await blogTypeDAO.deleteOneBlogType(id);
    // 需要返回受影响的文章数量
    return true;
  }
}

const blogTypeService = BlogTypeService.getInstance();
export default blogTypeService;
