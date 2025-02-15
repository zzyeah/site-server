import express from "express";
import { asyncHandler } from "../../../utils/apiHandler";
import bookService from "../../../service/book.service";
import { FindBookByPageRequest } from "../../../types/api/book/findBookByPage.request";

const bookRouter = express.Router();

/**
 * 根据分页获取书籍
 */
bookRouter.get(
  "/",
  asyncHandler(async (req: FindBookByPageRequest, res, next) => {
    return await bookService.findBookByPage(req.query);
  })
);

/**
 * 获取其中一本书籍信息
 */
bookRouter.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await bookService.findBookById(req.params.id);
  })
);

/**
 * 新增书籍
 */
bookRouter.post(
  "/",
  asyncHandler(async (req, res, next) => {
    return await bookService.addBook(req.body);
  })
);

/**
 * 删除书籍
 */
bookRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await bookService.deleteBook(req.params.id);
  })
);

/**
 * 修改书籍
 */
bookRouter.patch(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await bookService.updateBook(req.params.id, req.body);
  })
);

export default bookRouter;
