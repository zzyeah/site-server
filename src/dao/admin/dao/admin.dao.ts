import { AdminLoginInfo } from "../../../types";
import AdminModel, { AdminAttributes } from "../model/admin.model";

// login
export class AdminDAO {
  public static instance: AdminDAO = new AdminDAO();

  public static getInstance() {
    if (!AdminDAO.instance) AdminDAO.instance = new AdminDAO();
    return AdminDAO.instance;
  }

  public async login(loginInfo: AdminLoginInfo) {
    const { loginId, loginPwd } = loginInfo;
    try {
      const data = await AdminModel.findOne({
        attributes: ["loginId", "name", "id"],
        where: {
          loginId,
          loginPwd,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateAdmin(newAccountInfo: AdminAttributes) {
    return await AdminModel.update(newAccountInfo, {
      where: {
        loginId: newAccountInfo.loginId,
        id: newAccountInfo.id,
      },
    });
  }

  public async updateAdminById(id: string, newAccountInfo: AdminAttributes) {
    return await AdminModel.update(newAccountInfo, {
      where: {
        id,
      },
    });
  }
  public async getAdminList() {
    return await AdminModel.findAll();
  }

  public async registerAdmin(accountInfo: AdminAttributes) {
    return await AdminModel.create(accountInfo);
  }

  public async findAdmin(loginId: string) {
    return await AdminModel.findOne({
      where: { loginId },
    });
  }

  public async findAdminById(id: number) {
    return await AdminModel.findOne({
      where: { id },
    });
  }

  public async deleteAdmin(id: string) {
    return await AdminModel.destroy({
      where: {
        id,
      },
    });
  }
}

const adminDAO = AdminDAO.getInstance();
export default adminDAO;
