import { LoginInfo } from "../../../types";
import AdminModel from "../model/admin.model";

// login
export class AdminDAO {
  public static instance: AdminDAO = new AdminDAO();

  public static getInstance() {
    if (!AdminDAO.instance) AdminDAO.instance = new AdminDAO();
    return AdminDAO.instance;
  }

  public async login(loginInfo: LoginInfo) {
    const { loginId, loginPwd } = loginInfo;
    try {
      const data = await AdminModel.findOne({
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
}

const adminDAO = AdminDAO.getInstance();
export default adminDAO;
