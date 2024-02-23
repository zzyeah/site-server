import { verify } from "jsonwebtoken";
import { md5 } from "./crypto";
import multer, { diskStorage } from "multer";
import path from "path";

export function parseToken(token: string | undefined) {
  if (!token) {
    // 没有token
    return null;
  }
  // authorization: bearer token
  const parts = token.split(" ");
  if (parts.length > 0) {
    token = parts.length === 1 ? parts[0] : parts[1];
  }
  // }
  try {
    const result = verify(token, md5(process.env.JWT_SECRECT!));
    return result;
  } catch (error) {
    // logger.log(error);
    return null;
  }
}

const storage = diskStorage({
  // 文件存储路径
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../public/static/uploads");
  },
  // 上传到服务器的文件，文件名要做单独处理
  filename: (req, file, cb) => {
    // 获取文件名
    const basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // 获取后缀名
    const ext = path.extname(file.originalname);
    // 构建新名字
    const newName = `${basename}-${new Date().getTime()}-${Math.floor(
      Math.random() * 9000 + 1000
    )}${ext}`;
    cb(null, newName);
  },
});

export const uploading = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});
