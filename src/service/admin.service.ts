// admin 模块业务逻辑层

import { sign } from "jsonwebtoken";
import adminDAO from "../dao/admin/dao/admin.dao";
import { Constraints, LoginInfo, updateAdminRequest } from "../types";
import { md5 } from "../utils/crypto";
import { ForbiddenError, ValidationError } from "../utils/errors";
import { AdminAttributes } from "../dao/admin/model/admin.model";
import validate from "validate.js";
import { Request } from "express";
import { parseToken2Info } from "../utils";

validate.validators.accountIsExist = async function (loginId: string) {
  const data = await adminDAO.findAdmin(loginId);
  if (data) return "Account is Exist";
  return;
};

validate.validators.noPassValueByParams = async function (value: any) {
  const isEmpty = validate.isEmpty(value);
  if (isEmpty) return;
};

class AdminService {
  public static instance: AdminService;

  public static getInstance() {
    if (!AdminService.instance) AdminService.instance = new AdminService();
    return AdminService.instance;
  }

  public async login(loginInfo: LoginInfo) {
    loginInfo.loginPwd = md5(loginInfo.loginPwd);
    // 接下来进行数据的验证 => 查询数据库数据
    const data = await adminDAO.login(loginInfo);
    let result: AdminAttributes | null = null;
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

  public async updateAdmin(accountInfo: updateAdminRequest) {
    // 1. 根据传入的账号信息查询对应的用户（需使用旧密码）
    const adminInfo = await adminDAO.login({
      loginId: accountInfo.loginId,
      loginPwd: md5(accountInfo.oldLoginPwd),
    });
    // 2. 两种情况
    // 有无用户信息
    if (adminInfo?.dataValues) {
      // 有用户信息
      // 合并对象，然后更新
      const newPwd = md5(accountInfo.loginPwd);
      await adminDAO.updateAdmin({
        name: accountInfo.name,
        loginId: accountInfo.loginId,
        loginPwd: newPwd,
        id: adminInfo.dataValues.id,
        avatar: adminInfo.dataValues.avatar,
        permission: adminInfo.dataValues.permission,
        enabled: adminInfo.dataValues.enabled,
      });
      return {
        loginId: accountInfo.loginId,
        name: accountInfo.name,
        id: adminInfo.dataValues.id,
      };
    } else {
      // 无用户信息
      throw new ValidationError("旧密码不正确");
    }
  }
  public async updateAdminById(req: Request) {
    // 解析Token
    const result = parseToken2Info(req);
    if (result) {
      const updateContent = req.body;
      // id => 当前用户使用的id
      const { id: currentId, loginId, name } = result;
      const currentAdminInfo = await adminDAO.findAdminById(+currentId);
      const modifyAdminInfo = await adminDAO.findAdminById(+req.params.id);
      // 有无用户信息
      if (currentAdminInfo?.dataValues && modifyAdminInfo?.dataValues) {
        // 判断当前用户的权限大于或等于将被修改的用户的权限
        // 有用户信息
        if (
          currentAdminInfo.dataValues.permission <=
          modifyAdminInfo.dataValues.permission
        ) {
          // 合并对象，然后更新
          try {
            const data = {
              ...modifyAdminInfo.dataValues,
              ...updateContent,
            };
            await adminDAO.updateAdminById(
              modifyAdminInfo.dataValues.id!,
              data
            );
          } catch (error) {
            console.log(error);
          }
          return {
            loginId: modifyAdminInfo.dataValues.loginId,
            name: modifyAdminInfo.dataValues.name,
            id: modifyAdminInfo.dataValues.id,
          };
        }
      } else {
        // 无用户信息
        throw new ValidationError("旧密码不正确");
      }
    } else {
      throw new ForbiddenError("登陆过期");
    }
  }
  public async getAdminList() {
    return await adminDAO.getAdminList();
  }
 
  public async findAdminById(id: string) {
    return await adminDAO.findAdminById(+id);
  }

  public async findAdmin(id: string) {
    return await adminDAO.findAdmin(id);
  }
  public async deleteAdmin(id: string) {
    return await adminDAO.deleteAdmin(id);
  }
  public async registerAdmin(accountInfo: AdminAttributes) {
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
      avatar: {
        presence: {
          allowEmpty: true,
        },
        type: "string",
      },
      permission: {
        presence: {
          allowEmpty: false,
        },
        type: "number",
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
      return await adminDAO.registerAdmin(account);
    } catch (error) {
      throw new ValidationError("数据验证失败");
    }
  }
}

const adminService = AdminService.getInstance();
export default adminService;
