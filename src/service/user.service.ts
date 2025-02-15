// user 模块业务逻辑层

import { sign } from "jsonwebtoken";
import {
  CommonRequest,
  Constraints,
  SqlModelInstance,
  UserAttributes,
  UserInfo,
  UserLoginRequest,
  UserRegisterRequest,
} from "../types";
import { md5 } from "../utils/crypto";
import {
  ForbiddenError,
  NotFoundError,
  UnknownError,
  ValidationError,
} from "../utils/errors";
import validate from "validate.js";
import { Request } from "express";
import { parseToken2Info, transferUserInfo } from "../utils";
import userDAO from "../dao/user/dao/user.dao";
import { updateUserRequest } from "../types/model/user/userUpdate.request";
import { UserCheckPwdRequest } from "src/types/model/user/userCheckPwd.request";

validate.validators.accountIsExist = async function (loginId: string) {
  const data = await userDAO.findUser(loginId);
  if (data) return "Account is Exist";
  return;
};

validate.validators.noPassValueByParams = async function (value: any) {
  const isEmpty = validate.isEmpty(value);
  if (isEmpty) return;
};

class UserService {
  public static instance: UserService;

  public static getInstance() {
    if (!UserService.instance) UserService.instance = new UserService();
    return UserService.instance;
  }

  public async login(loginInfo: UserLoginRequest) {
    loginInfo.loginPwd = md5(loginInfo.loginPwd);
    // 接下来进行数据的验证 => 查询数据库数据
    const data = await userDAO.login(loginInfo);
    if (data?.dataValues) {
      const { dataValues } = data;
      if (!dataValues.enabled) {
        throw new ValidationError("账号未启用");
      }
      userDAO.updateUser({
        ...dataValues,
        lastLoginDate: new Date().getTime(),
      });
      const lastResult = transferUserInfo(dataValues);
      let loginPeriod: number = 1;
      if (loginInfo.remember) {
        // 用户勾选登陆7天，remember会有值
        loginPeriod = parseInt(`${loginInfo.remember}`);
      }

      // 生成token
      const token = sign(
        {
          id: dataValues.id,
          loginId: dataValues.loginId,
          name: dataValues.name,
        },
        md5(process.env.JWT_SECRECT!),
        {
          expiresIn: 60 * 60 * 24 * loginPeriod,
        }
      );
      return {
        token,
        data: lastResult,
      };
    }
    throw new ValidationError("账号或密码错误");
  }

  public async updateUser(accountInfo: updateUserRequest) {
    // 1. 根据传入的账号信息查询对应的用户（需使用旧密码）
    const userInfo = await userDAO.login({
      loginId: accountInfo.loginId,
      loginPwd: md5(accountInfo.oldLoginPwd),
    });
    // 2. 两种情况
    // 有无用户信息
    if (userInfo?.dataValues) {
      // 有用户信息
      // 合并对象，然后更新
      const newPwd = md5(accountInfo.loginPwd);
      await userDAO.updateUser({
        ...userInfo.dataValues,
        name: accountInfo.name,
        loginId: accountInfo.loginId,
        loginPwd: newPwd,
        lastLoginDate: new Date().getTime(),
      });
      return {
        loginId: accountInfo.loginId,
        name: accountInfo.name,
        id: userInfo.dataValues.id,
      };
    } else {
      // 无用户信息
      throw new ValidationError("旧密码不正确");
    }
  }
  public async updateUserById(req: CommonRequest<updateUserRequest>) {
    // 解析Token
    const result = parseToken2Info(req);
    if (result) {
      const updateContent = req.body;
      // id => 当前用户使用的id
      const { id: currentId, loginId, name } = result;
      if (+currentId === +req.params.id) {
        // 判断当前用户是否为将被修改的用户
        const modifyUserInfo = await userDAO.findUserById(req.params.id);
        const pwd = await userDAO.findUserPasswordById(modifyUserInfo?.dataValues.id!);
        if (!modifyUserInfo?.dataValues) {
          // 无用户信息
          // TODO: 需要处理如果前台没有输入旧密码直接传值的情况
          throw new ValidationError("旧密码不正确");
        }
        // 有无用户信息
        if (modifyUserInfo?.dataValues) {
          // 判断当前用户的权限大于或等于将被修改的用户的权限
          // 有用户信息
          // 合并对象，然后更新
          try {
            if (updateContent.loginPwd) {
              updateContent.loginPwd = md5(updateContent.loginPwd);
            }
            const data = {
              ...modifyUserInfo.dataValues,
              ...updateContent,
            };
            await userDAO.updateUserById(modifyUserInfo.dataValues.id!, data);
            return await userDAO.findUserById(modifyUserInfo.dataValues.id!);
          } catch (error) {
            console.log(error);
            return new UnknownError("未知错误");
          }
        }
      } else {
        throw new ValidationError("非相同用户");
      }
    } else {
      throw new ForbiddenError("登陆过期");
    }
  }
  public async getUserList() {
    return await userDAO.getUserList();
  }

  public async findUserById(id: string) {
    return await userDAO.findUserById(id);
  }

  public async findUserIsExist(id: string) {
    const result = await userDAO.findUser(id);
    return Boolean(result);
  }
  public async deleteUser(id: string) {
    return await userDAO.deleteUser(id);
  }
  public async registerUser(
    accountInfo: UserRegisterRequest
  ): Promise<UserInfo> {
    const accountRule: Constraints = {
      loginId: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
        accountIsExist: true,
      },
      name: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      loginPwd: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
    };
    try {
      await validate.async(accountInfo, accountRule);
      const account: UserAttributes = {
        ...accountInfo,
        loginPwd: md5(accountInfo.loginPwd),
        enabled:
          typeof accountInfo.enabled === "number" ? accountInfo.enabled : 1,
        avatar: "/static/avatar/666.png",
        lastLoginDate: new Date().getTime(),
        points: 0,
        registerDate: new Date().getTime(),
      };
      const registerInfo = await userDAO.registerUser(account);
      const { loginPwd, ...result } = registerInfo.dataValues;
      return result;
    } catch (error) {
      throw new ValidationError("数据验证失败");
    }
  }

  public async findUserByPointsRank(): Promise<
    SqlModelInstance<
      Pick<UserAttributes, "id" | "name" | "points" | "avatar">
    >[]
  > {
    return await userDAO.findUserByPointsRank();
  }

  public async passwordCheck({ id, loginPwd }: UserCheckPwdRequest) {
    const userInfo = await userDAO.findUserById(id);
    if (!userInfo) {
      throw new NotFoundError("用户不存在");
    }
    const info = await userDAO.findUserPasswordById(id);
    if (info!.dataValues.loginPwd === md5(loginPwd)) {
      return true;
    } else {
      return false;
    }
  }
}

const userService = UserService.getInstance();
export default userService;
