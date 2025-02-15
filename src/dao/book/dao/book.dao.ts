import { Op, WhereOptions } from "sequelize";
import { FindBookByPageQuery } from "../../../types/api/book/findBookByPage.request";
import bookModel from "../model/book.model";
import BookModel, { BookAttributes } from "../model/book.model";

export class BookDAO {
  public static instance: BookDAO = new BookDAO();

  public static getInstance() {
    if (!BookDAO.instance) BookDAO.instance = new BookDAO();
    return BookDAO.instance;
  }

  /**
   * 分页查找书籍
   */
  async findBookByPage(queryObj: FindBookByPageQuery) {
    const { typeId, limit = 10, page = 1, bookTitle } = queryObj;

    const pageObj = {
      page: Number(page),
      limit: Number(limit),
    };

    const where: WhereOptions<BookAttributes> = {
      [Op.and]: {},
    };
    if (bookTitle) {
      // 用户要按照书籍标题进行搜索
      where[Op.and] = {
        ...where[Op.and],
        bookTitle: {
          [Op.like]: `%${bookTitle}`,
        },
      };
    }
    if (typeId) {
      // 用户要按照分类进行搜索
      where[Op.and] = {
        ...where[Op.and],
        typeId,
      };
    }

    const count = await bookModel.count({ where });
    const totalPage = Math.ceil(count / pageObj.limit); // 总页数
    const data = await bookModel.findAll({
      where,
      order: [["onShelfDate", "DESC"]],
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
   * 根据 id 获取其中一本书籍信息
   */
  async findBookById(id: string) {
    return bookModel.findOne({
      where: { id },
    });
  }

  /**
   * 新增书籍
   */
  async addBook(newBookInfo: BookAttributes) {
    return await bookModel.create(newBookInfo);
  }

  /**
   * 根据 id 删除书籍
   */
  async deleteBook(id: string) {
    return bookModel.destroy({
      where: { id },
    });
  }

  /**
   * 根据 id 修改书籍
   */

  async updateBook(id: string, newInfo: BookAttributes) {
    return bookModel.update(newInfo, { where: { id } });
  }
}

const bookDAO = BookDAO.getInstance();
export default bookDAO;
