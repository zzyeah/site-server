// admin 模块业务逻辑层

import { sign } from "jsonwebtoken";
import adminDAO from "../dao/admin/dao/admin.dao";
import { LoginInfo } from "../types";
import { md5 } from "../utils/crypto";

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
    let result: any = null;
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
}

const adminService = AdminService.getInstance();
export default adminService;
