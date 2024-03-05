// blog 模块业务逻辑层

import validate from "validate.js";
import { Constraints, FindBlogByPageQuery } from "../types";
import blogTypeDAO from "../dao/blogType/dao/blogType.dao";
import BlogTypeModel, {
  BlogTypeAttributes,
} from "../dao/blogType/model/blogType.model";
import { BlogAttributes } from "../dao/blog/model/blog.model";
import { NotFoundError, UnknownError, ValidationError } from "../utils/errors";
import blogDAO from "../dao/blog/dao/blog.dao";

validate.validators.categoryIdIsExist = async function (id) {
  const info = await BlogTypeModel.findByPk(id);
  if (info) return;
  return "Category Id is not exist";
};

class BlogService {
  public static instance: BlogService;

  public static getInstance() {
    if (!BlogService.instance) BlogService.instance = new BlogService();
    return BlogService.instance;
  }

  // 新增博客
  async addBlog(newBlogInfo: BlogAttributes) {
    // 处理toc

    // 将处理结果转成字符串
    if (newBlogInfo.toc) {
      newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);
    } else {
      // mock data
      newBlogInfo.toc = JSON.stringify([
        {
          a: "b",
        },
      ]);
    }

    // 初始化文章信息
    newBlogInfo.scanNumber = 0; // 阅读量初始化为0
    newBlogInfo.commentNumber = 0; // 评论数初始化为0

    // 定义验证规则
    const constraints: Constraints = {
      title: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      description: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      toc: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      htmlContent: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      thumb: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      scanNumber: {
        presence: {
          allowEmpty: false,
        },
        type: "integer",
      },
      commentNumber: {
        presence: {
          allowEmpty: false,
        },
        type: "integer",
      },
      createDate: {
        presence: {
          allowEmpty: false,
        },
        type: "integer",
      },
      categoryId: {
        presence: true,
        type: "integer",
        categoryIdIsExist: true,
      },
    };

    // 验证数据
    try {
      await validate.async(newBlogInfo, constraints);
      const data = await blogDAO.addBlog(newBlogInfo);
      // 新增博客分类
      await blogTypeDAO.addBlogToType(newBlogInfo.categoryId!);
      return data;
    } catch (err) {
      throw new ValidationError("数据验证失败");
    }
  }

  // 查询博客分页内容
  async findBlogByPage(pageInfo: FindBlogByPageQuery) {
    const data = await blogDAO.findBlogByPage(pageInfo);
    data.rows.forEach((row) => {
      row.setDataValue("toc", JSON.parse(row.dataValues.toc));
    });
    const { count: total, rows } = data;
    return {
      total,
      rows,
    };
  }

  // 获取单个博客分类
  async findBlogById(id: string, authorization?: string) {
    const data = await blogDAO.findBlogById(id);
    if (!data) return;
    // 重新处理TOC, 还原成数组
    data.dataValues.toc = JSON.parse(data.dataValues.toc);
    // 根据auth 是否有值来决定浏览数是否要自增
    if (!authorization) {
      data.setDataValue("scanNumber", data.dataValues.scanNumber + 1);
      await data.save();
    }

    return data.dataValues;
  }

  // 修改单个博客
  async updateBlog(id: string, newBlogInfo: BlogAttributes) {
    // 判断正文内容有无改变，因为正文内容影响TOC
    // 判断是否有TOC，有则处理
    if (newBlogInfo.htmlContent) {
      // 有新增内容，需要重新处理TOC
      newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);
    }
    const data = await blogDAO.updateBlog(id, newBlogInfo);
    if (!data) throw new NotFoundError("更新失败");
    return data.dataValues;
  }

  // 删除单个博客
  async deleteBlog(id: string) {
    // 根据id查询到该文章信息
    const data = await blogDAO.findBlogById(id);
    if (!data) throw new NotFoundError("查找文章失败，无法删除");
    const categoryInfo = await blogTypeDAO.findOneBlogType(
      data.dataValues.categoryId
    );
    if (!categoryInfo) throw new NotFoundError("查找分类失败，无法删除");
    categoryInfo.setDataValue(
      "articleCount",
      categoryInfo.dataValues.articleCount - 1
    );
    await categoryInfo.save();
    // 删除该文章的所有评论

    const count = await blogDAO.deleteBlog(id);
    return true;
  }
}

const blogService = BlogService.getInstance();
export default blogService;
