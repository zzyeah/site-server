import express from "express";
import adminService from "../../../service/admin.service";
import { asyncHandler, getResult } from "../../../utils/apiHandler";
import { parseToken } from "../../../utils/tools";

const adminRouter = express.Router();

/* admin login */
adminRouter.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    // 首先验证验证码

    // 假设验证码通过
    const loginInfo = req.body;
    const result = await adminService.login(loginInfo);
    if (result?.token) {
      res.setHeader("authorization", result.token);
    }
    return result.data;
  })
);

// 恢复登陆状态
adminRouter.get(
  "/whoami",
  asyncHandler(async (req, res, next) => {
    // 1. 从客户端的请求拿到token
    const token = req.get("authorization");
    // 2. 解析token，还原成有用信息
    const result = parseToken(token);
    // 3. 返回给客户端
    return {
      id: result!["id"],
      loginId: result!["loginId"],
      name: result!["name"],
    };
  })
);

export default adminRouter;
