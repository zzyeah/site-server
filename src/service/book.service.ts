import { ValidationError } from "../utils/errors";
import bookDao from "../dao/book/dao/book.dao";
import { BookAttributes } from "../dao/book/model/book.model";
import { Constraints } from "../types/validatejs/validate-rule.bean";
import validate from "validate.js";
import commentDAO from "../dao/comment/dao/comment.dao";
import { FindBookByPageQuery } from "../types/api/book/findBookByPage.request";

class BookService {
  public static instance: BookService;

  public static getInstance() {
    if (!BookService.instance) BookService.instance = new BookService();
    return BookService.instance;
  }

  /**
   * 按分页查询书籍
   */
  async findBookByPage(queryObj: FindBookByPageQuery) {
    return await bookDao.findBookByPage(queryObj);
  }

  /**
   * 根据 id 获取其中一本书籍信息
   */
  async findBookById(id: string) {
    return await bookDao.findBookById(id);
  }

  /**
   * 新增书籍
   */
  async addBook(newBookInfo: BookAttributes) {
    // 首先进行同步的数据验证
    const bookRule: Constraints<BookAttributes> = {
      bookTitle: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      bookPic: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      downloadLink: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      bookIntro: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      requirePoints: {
        presence: {
          allowEmpty: false,
        },
        type: "number",
      },
      typeId: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
    };

    const validateResult = validate.validate(newBookInfo, bookRule);
    if (!validateResult) {
      // 验证通过

      // 添加其他的信息
      newBookInfo.scanNumber = 0; // 浏览数，默认为 0
      newBookInfo.commentNumber = 0; // 评论数，默认为 0
      // 上架日期
      newBookInfo.onShelfDate = new Date().getTime().toString();

      // 如果没有上传图片，则默认给一张图片
      if (!newBookInfo.bookPic) {
        newBookInfo.bookPic = "/static/imgs/noPic.jpg";
      }
      return await bookDao.addBook(newBookInfo);
    } else {
      // 数据验证失败
      return new ValidationError("数据验证失败");
    }
  }

  /**
   * 删除书籍
   */
  async deleteBook(id: string) {
    // 首先需要删除该书籍对应的评论

    // 获取该 bookId 对应的所有评论
    const commentResult = await commentDAO.findBookCommentById(id);
    console.log(commentResult, "commentResult");
    if ("data" in commentResult) {
      const { data } = commentResult;
      for (let i = 0; i < data.length; i++) {
        await commentDAO.deleteComment(data[i].dataValues.id!);
      }
    } else {
      for (let i = 0; i < commentResult.length; i++) {
        await commentDAO.deleteComment(commentResult[i].dataValues.id!);
      }
    }

    // 接下来再删除该书籍
    return await bookDao.deleteBook(id);
  }

  /**
   * 修改书籍
   */
  async updateBook(id: string, newInfo: BookAttributes) {
    return await bookDao.updateBook(id, newInfo);
  }
}

const bookService = BookService.getInstance();
export default bookService;
