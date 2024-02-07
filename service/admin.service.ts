// admin 模块业务逻辑层

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
    if (data?.dataValues) {
    }
    return { data };
  }
}

const adminService = AdminService.getInstance();
export default adminService;
