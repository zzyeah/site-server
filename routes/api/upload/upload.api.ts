import { Router } from "express";
import { getResult } from "../../../utils/apiHandler";
import { CommonRequest } from "../../../types";
import { uploading } from "../../../utils/tools";
import { MulterError } from "multer";
import { UploadError } from "../../../utils/errors";

const uploadRouter = Router();

// 上传文件
uploadRouter.post("/", async (req: CommonRequest<[]>, res, next) => {
  // single 方法里面书写上传控件的 name 值
  uploading.single("file")(req, res, (err) => {
    if (err instanceof MulterError) {
      next(
        new UploadError("上传文件失败，请检查文件的大小，控制在1024*1024*1024")
      );
      return;
    } else {
      const path = `/static/uploads/${req.file?.filename}`;
      res.send(getResult({ data: path }));
    }
  });
});

export default uploadRouter;
