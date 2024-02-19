import express from "express";
import adminService from "../../../service/admin.service";
import { asyncHandler, getResult } from "../../../utils/apiHandler";
import { parseToken } from "../../../utils/tools";
import { CommonRequest } from "../../../types/model/common/request.bean";
import { LoginInfo } from "../../../types";
import { ValidationError } from "../../../utils/errors";

const adminRouter = express.Router();

/* admin login */
adminRouter.post(
  "/login",
  asyncHandler(async (req: CommonRequest<LoginInfo>, res, next) => {
    const loginInfo = req.body;
    // 首先验证验证码
    if (
      loginInfo.captcha?.toLowerCase() !== req.session["captcha"]?.toLowerCase()
    ) {
      // 说明用户输入的验证码不正确
      throw new ValidationError("验证码不正确");
    }
    // 假设验证码通过
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

adminRouter.put(
  "/",
  asyncHandler(async (req, res, next) => {
    return await adminService.updateAdmin(req.body);
  })
);

export default adminRouter;
