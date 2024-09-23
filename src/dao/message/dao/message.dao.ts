import { Op } from "sequelize";
import { FindMessageByPageInfo } from "../../../types";
import MessageModel, { MessageAttributes } from "../model/message.model";
import BlogModel from "../../blog/model/blog.model";
import { SQLExcuteError } from "../../../utils";

// message
export class MessageDAO {
  public static instance: MessageDAO = new MessageDAO();

  public static getInstance() {
    if (!MessageDAO.instance) MessageDAO.instance = new MessageDAO();
    return MessageDAO.instance;
  }

  public async addMessage(newMessage: MessageAttributes) {
    return await MessageModel.create(newMessage);
  }

  async findMessageByPage(pageInfo: FindMessageByPageInfo) {
    // 根据 blogId 区分查询情况
    // 有 -> 获取对应 blogId 的文章评论
    // 无 -> 获取留言
    const { blogId } = pageInfo;
    if (blogId) {
      /**
       * 两种情况
       * 1. 获取所有文章评论 -> blogId === "all"
       * 2. 获取对应文章的评论 -> blogId !== "all"
       */
      const targetBlogId = (+blogId).toString() === "NaN" ? "all" : blogId;
      if (blogId === "all" || targetBlogId === "all") {
        return await MessageModel.findAndCountAll({
          offset: (+pageInfo.page! - 1) * +pageInfo.limit!,
          limit: +pageInfo.limit!,
          where: {
            blogId: {
              [Op.ne]: null,
            },
          },
          include: [
            {
              model: BlogModel,
              as: "blog",
            },
          ],
        });
      }
      try {
        return await MessageModel.findAndCountAll({
          offset: (+pageInfo.page! - 1) * +pageInfo.limit!,
          limit: +pageInfo.limit!,
          where: {
            blogId: targetBlogId,
          },
          order: [["createDate", "DESC"]],
        });
      } catch (error) {
        throw new SQLExcuteError(error);
      }
    } else {
      // 获取留言
      try {
        return await MessageModel.findAndCountAll({
          offset: (+pageInfo.page! - 1) * +pageInfo.limit!,
          limit: +pageInfo.limit!,
          where: {
            blogId: null,
          },
          order: [["createDate", "DESC"]],
        });
      } catch (error) {
        throw new SQLExcuteError(error);
      }
    }
  }

  // 删除 messageId 对应留言或者评论
  async deleteMessage(id: string) {
    try {
      return await MessageModel.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new SQLExcuteError(error);
    }
  }

  // 根据 blogId 留言或者评论
  async deleteMessageByBlogId(blogId: string) {
    try {
      return await MessageModel.destroy({
        where: {
          blogId,
        },
      });
    } catch (error) {
      throw new SQLExcuteError(error);
    }
  }
}

const messageDAO = MessageDAO.getInstance();
export default messageDAO;
