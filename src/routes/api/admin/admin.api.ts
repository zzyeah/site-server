import express from "express";
import adminService from "../../../service/admin.service";
import { asyncHandler } from "../../../utils/apiHandler";
import { parseToken2Info } from "../../../utils/tools";
import { CommonRequest } from "../../../types/api/common/request.bean";
import { AdminLoginInfo, updateAdminRequest } from "../../../types";
import { ValidationError } from "../../../utils/errors";
import { AdminAttributes } from "../../../dao/admin/model/admin.model";

const adminRouter = express.Router();

/* admin login */
adminRouter.post(
  "/login",
  asyncHandler(async (req: CommonRequest<AdminLoginInfo>, res, next) => {
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
    const result = parseToken2Info(req);
    // 返回给客户端
    if (result) {
      return {
        id: result.id,
        loginId: result.loginId,
        name: result.name,
      };
    }
  })
);

adminRouter.put(
  "/",
  asyncHandler(async (req: CommonRequest<updateAdminRequest>, res, next) => {
    return await adminService.updateAdmin(req.body);
  })
);
adminRouter.put(
  "/:id",
  asyncHandler(async (req: CommonRequest<updateAdminRequest>, res, next) => {
    return await adminService.updateAdminById(req);
  })
);
adminRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await adminService.getAdminList();
  })
);

adminRouter.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await adminService.findAdminById(req.params.id);
  })
);

adminRouter.get(
  "/adminIsExist/:id",
  asyncHandler(async (req, res, next) => {
    return await adminService.findAdminIsExist(req.params.id);
  })
);
/**
 * 注册管理员
 */
adminRouter.post(
  "/",
  asyncHandler(async (req: CommonRequest<AdminAttributes>, res, next) => {
    return await adminService.registerAdmin(req.body);
  })
);

adminRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await adminService.deleteAdmin(req.params.id);
  })
);
export default adminRouter;
