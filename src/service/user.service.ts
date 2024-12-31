// user 模块业务逻辑层

import { sign } from "jsonwebtoken";
import { Constraints, UserLoginInfo, UserRegisterInfo } from "../types";
import { md5 } from "../utils/crypto";
import { ForbiddenError, ValidationError } from "../utils/errors";
import validate from "validate.js";
import { Request } from "express";
import { parseToken2Info } from "../utils";
import userDAO from "../dao/user/dao/user.dao";
import { UserAttributes } from "../dao/user/model/user.model";
import { updateUserRequest } from "../types/model/user/updateUser.request";

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

  public async login(loginInfo: UserLoginInfo) {
    loginInfo.loginPwd = md5(loginInfo.loginPwd);
    // 接下来进行数据的验证 => 查询数据库数据
    const data = await userDAO.login(loginInfo);
    let result: UserAttributes | null = null;
    if (data?.dataValues) {
      result = data.dataValues;
      let loginPeriod: number = 1;
      if (loginInfo.remember) {
        // 用户勾选登陆7天，remember会有值
        loginPeriod = parseInt(`${loginInfo.remember}`);
      }

      // 生成token
      const token = sign(
        {
          id: result.id,
          loginId: result.loginId,
          name: result.name,
        },
        md5(process.env.JWT_SECRECT!),
        {
          expiresIn: 60 * 60 * 24 * loginPeriod,
        }
      );
      return {
        token,
        data: result,
      };
    }
    return { data: result };
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
        name: accountInfo.name,
        loginId: accountInfo.loginId,
        loginPwd: newPwd,
        id: userInfo.dataValues.id,
        avatar: userInfo.dataValues.avatar,
        permission: userInfo.dataValues.permission,
        enabled: userInfo.dataValues.enabled,
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
  public async updateUserById(req: Request) {
    // 解析Token
    const result = parseToken2Info(req);
    if (result) {
      const updateContent = req.body;
      // id => 当前用户使用的id
      const { id: currentId, loginId, name } = result;
      if (+currentId === +req.params.id) {
        // 判断当前用户是否为将被修改的用户
        const modifyUserInfo = await userDAO.findUserById(+req.params.id);
        // 有无用户信息
        if (modifyUserInfo?.dataValues) {
          // 判断当前用户的权限大于或等于将被修改的用户的权限
          // 有用户信息
          // 合并对象，然后更新
          try {
            const data = {
              ...modifyUserInfo.dataValues,
              ...updateContent,
            };
            await userDAO.updateUserById(modifyUserInfo.dataValues.id!, data);
          } catch (error) {
            console.log(error);
          }
          return {
            loginId: modifyUserInfo.dataValues.loginId,
            name: modifyUserInfo.dataValues.name,
            id: modifyUserInfo.dataValues.id,
          };
        } else {
          // 无用户信息
          throw new ValidationError("旧密码不正确");
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
    return await userDAO.findUserById(+id);
  }

  public async findUserIsExist(id: string) {
    const result = await userDAO.findUser(id);
    return Boolean(result);
  }
  public async deleteUser(id: string) {
    return await userDAO.deleteUser(id);
  }
  public async registerUser(accountInfo: UserRegisterInfo) {
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
      const account = {
        ...accountInfo,
        loginPwd: md5(accountInfo.loginPwd),
        enabled: !validate.isEmpty(accountInfo.enabled)
          ? accountInfo.enabled
          : 1,
      };
      const registerInfo = await userDAO.registerUser(account);
      return {
        loginId: registerInfo.dataValues.id,
        name: registerInfo.dataValues.name,
      };
    } catch (error) {
      throw new ValidationError("数据验证失败");
    }
  }
}

const userService = UserService.getInstance();
export default userService;
