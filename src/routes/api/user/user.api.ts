import express from "express";
import userService from "../../../service/user.service";
import { asyncHandler } from "../../../utils/apiHandler";
import { parseToken2Info } from "../../../utils/tools";
import { CommonRequest } from "../../../types/api/common/request.bean";
import {
  UserLoginRequest,
  UserRegisterRequest,
  updateUserRequest,
} from "../../../types";
import { ValidationError } from "../../../utils/errors";
import { UserCheckPwdRequest } from "src/types/model/user/userCheckPwd.request";

const userRouter = express.Router();

/* user login */
userRouter.post(
  "/login",
  asyncHandler(async (req: CommonRequest<UserLoginRequest>, res, next) => {
    const loginInfo = req.body;
    // 首先验证验证码
    if (
      loginInfo.captcha?.toLowerCase() !== req.session["captcha"]?.toLowerCase()
    ) {
      // 说明用户输入的验证码不正确
      throw new ValidationError("验证码不正确");
    }
    // 假设验证码通过
    const result = await userService.login(loginInfo);
    if (result?.token) {
      res.setHeader("authorization", result.token);
    }
    return result.data;
  })
);

// 恢复登陆状态
userRouter.get(
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

userRouter.get(
  "/pointsRank",
  asyncHandler(async (req, res, next) => {
    return await userService.findUserByPointsRank();
  })
);

userRouter.patch(
  "/",
  asyncHandler(async (req: CommonRequest<updateUserRequest>, res, next) => {
    return await userService.updateUser(req.body);
  })
);

userRouter.patch(
  "/:id",
  asyncHandler(async (req: CommonRequest<updateUserRequest>, res, next) => {
    return await userService.updateUserById(req);
  })
);

userRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    return await userService.getUserList();
  })
);

userRouter.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await userService.findUserById(req.params.id);
  })
);

userRouter.get(
  "/userIsExist/:id",
  asyncHandler(async (req, res, next) => {
    return await userService.findUserIsExist(req.params.id);
  })
);
/**
 * 注册会员
 */
userRouter.post(
  "/",
  asyncHandler(async (req: CommonRequest<UserRegisterRequest>, res, next) => {
    const loginInfo = req.body;
    // 首先验证验证码
    if (
      loginInfo.captcha?.toLowerCase() !== req.session["captcha"]?.toLowerCase()
    ) {
      // 说明用户输入的验证码不正确
      throw new ValidationError("验证码不正确");
    }
    return await userService.registerUser(req.body);
  })
);

userRouter.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    return await userService.deleteUser(req.params.id);
  })
);

/**
 * 确认密码是否正确
 */
userRouter.post(
  "/passwordcheck",
  asyncHandler(async function (
    req: CommonRequest<UserCheckPwdRequest>,
    res,
    next
  ) {
    return await userService.passwordCheck(req.body);
  })
);

export default userRouter;
