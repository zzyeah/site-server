// admin 模块业务逻辑层

import { sign } from "jsonwebtoken";
import adminDAO, { AdminDAO } from "../dao/admin/dao/admin.dao";
import { LoginInfo, updateAdminRequest } from "../types";
import { md5 } from "../utils/crypto";
import { ForbiddenError, ValidationError } from "../utils/errors";
import { AdminAttributes } from "../dao/admin/model/admin.model";

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
    let result:AdminAttributes | null = null;
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
        permission: adminInfo.dataValues.permission
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

  public async getAdminList(){
    return adminDAO.getAdminList();
  }
}

const adminService = AdminService.getInstance();
export default adminService;
