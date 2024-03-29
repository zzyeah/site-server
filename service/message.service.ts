// 评论或留言模块业务逻辑层

import validate from "validate.js";
import { Constraints, FindMessageByPageInfo } from "../types";
import { ValidationError, readDirLength } from "../utils";
import { MessageAttributes } from "../dao/message/model/message.model";
import messageDAO from "../dao/message/dao/message.dao";
import blogDAO from "../dao/blog/dao/blog.dao";
import path from "path";

class MessageService {
  public static instance: MessageService;

  public static getInstance() {
    if (!MessageService.instance)
      MessageService.instance = new MessageService();
    return MessageService.instance;
  }

  async addMessage(newMessage: MessageAttributes) {
    const messageRule: Constraints = {
      nickname: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      content: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      blogId: {
        type: "string",
      },
    };

    try {
      await validate.async(newMessage, messageRule);
      newMessage.blogId = newMessage.blogId || undefined;
      newMessage.createDate = Date.now();

      // 有一个头像的地址,该头像是随机生成的
      // 读取 /static/avatar 目录
      const staticPath = "/static/avatar",
        pathLike = path.join(__dirname, "../public", staticPath);
      const files = await readDirLength(pathLike);
      // 随机输出一个文件
      const randomIndex = Math.floor(Math.random() * files.length);
      newMessage.avatar = path.join(staticPath, files[randomIndex]);

      const data = await messageDAO.addMessage(newMessage);
      // 如果是文章评论, 对应文章的评论数量也要自增
      if (newMessage.blogId) {
        const blog = await blogDAO.findBlogById(newMessage.blogId);
        if (blog) {
          blog.setDataValue("commentNumber", blog.dataValues.commentNumber + 1);
          blog.save();
        }
      }
      return data.dataValues;
    } catch (error) {
      throw new ValidationError("数据验证失败");
    }
  }

  // 分页获取评论或留言
  async findMessageByPage(pageInfo: FindMessageByPageInfo) {
    const result: FindMessageByPageInfo = { page: "1", limit: "10" };
    const params = Object.assign(result, pageInfo);
    const data = await messageDAO.findMessageByPage(params);
    const { count: total, rows } = data;
    return {
      total,
      rows,
    };
  }

  // 删除留言或者评论
  async deleteMessage(id: string) {
    await messageDAO.deleteMessage(id);
    return true;
  }
}

const messageService = MessageService.getInstance();
export default messageService;
