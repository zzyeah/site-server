import { QueryByPageParams } from "../../../types/api/common/queryByPage.bean";
import commentModel from "../model/comment.model";
import { CommentAttributes } from "../model/comment.model";
import { FindCommentByPageAndTypeQuery } from "../../../types/api/comment/findCommentByPageAndType.request";
import { WhereOptions, Op } from "sequelize";

export class CommentDAO {
  public static instance: CommentDAO = new CommentDAO();

  public static getInstance() {
    if (!CommentDAO.instance) CommentDAO.instance = new CommentDAO();
    return CommentDAO.instance;
  }

  /**
   * 根据分页查找问答评论或者书籍评论
   */

  async findCommentByPageAndType(
    commentType: string,
    queryObj: FindCommentByPageAndTypeQuery
  ) {
    const {
      typeId,
      keyword = "",
      limit = 10,
      page = 1,
      commentContent,
    } = queryObj;
    const pageObj = {
      page: Number(page),
      limit: Number(limit),
    };
    const where: WhereOptions<CommentAttributes> = {
      [Op.and]: {},
    };
    if (typeId) {
      // 用户要按照分类进行搜索
      where[Op.and] = {
        ...where[Op.and],
        typeId,
      };
    }
    // 按照评论内容进行查询
    if (commentContent) {
      // 用户要按照书籍标题进行搜索
      where[Op.and] = {
        ...where[Op.and],
        commentContent: {
          [Op.like]: `%${commentContent}`,
        },
      };
    }

    where[Op.or] = {
      commentType,
    };

    const count = await commentModel.count({
      where,
    }); // 数据总条数
    const totalPage = Math.ceil(count / pageObj.limit); // 总页数
    const data = await commentModel.findAll({
      where,
      order: [["commentDate", "DESC"]],
      offset: (+page * 1 - 1) * +limit,
      limit: +limit,
    });

    return {
      ...pageObj,
      count,
      totalPage,
      data,
    };
  }

  /**
   * 按照分页获取问答模块某一问题对应的评论
   */
  async findIssueCommentById(issueId: string, pageInfo?: QueryByPageParams) {
    // 如果没有传递 pager 对象，那就是要查询该 issueId 对应的所有评论
    if (!pageInfo) {
      return await commentModel.findAll({
        where: { issueId },
      });
    }

    const { typeId, keyword = "", limit = 10, page = 1 } = pageInfo;

    const pageObj = {
      page: Number(page),
      limit: Number(limit),
    };
    const count = await commentModel.count({
      where: { issueId },
    }); // 数据总条数
    const totalPage = Math.ceil(count / pageObj.limit); // 总页数
    const data = await commentModel.findAll({
      where: { issueId },
      order: [["commentDate", "DESC"]],
      offset: (+page * 1 - 1) * +limit,
      limit: +limit,
    });
    return {
      ...pageObj,
      count,
      totalPage,
      data,
    };
  }

  /**
   * 按照分页获取书籍模块某一本书对应的评论
   */
  async findBookCommentById(bookId: string, queryObj?: QueryByPageParams) {
    // 如果没有传递 pager 对象，那就是要查询该 bookId 对应的所有评论
    if (!queryObj) {
      return await commentModel.findAll({
        where: { bookId },
      });
    }

    const { typeId, keyword = "", limit = 10, page = 1, bookTitle } = queryObj;

    const pageObj = {
      page: Number(page),
      limit: Number(limit),
    };

    const count = await commentModel.count({ where: { bookId } }); // 数据总条数

    const totalPage = Math.ceil(count / pageObj.limit); // 总页数
    const data = await commentModel.findAll({
      where: {
        bookId,
      },
      offset: (+page * 1 - 1) * +limit,
      limit: +limit,
      order: [["commentDate", "DESC"]],
    });
    return {
      ...pageObj,
      count,
      totalPage,
      data,
    };
  }

  /**
   * 新增一条评论
   */
  async addComment(newCommentInfo) {
    if (!newCommentInfo.issueId) {
      newCommentInfo.issueId = null;
    } else {
      newCommentInfo.bookId = null;
    }
    try {
      return await commentModel.create(newCommentInfo);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * 根据 id 删除一条评论
   */
  async deleteComment(id: string) {
    return commentModel.destroy({
      where: { id },
    });
  }
}

const commentDAO = CommentDAO.getInstance();
export default commentDAO;
