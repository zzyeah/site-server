import { UserLoginInfo } from "../../../types";
import UserModel, { UserAttributes } from "../model/user.model";

// login
export class UserDAO {
  public static instance: UserDAO = new UserDAO();

  public static getInstance() {
    if (!UserDAO.instance) UserDAO.instance = new UserDAO();
    return UserDAO.instance;
  }

  public async login(loginInfo: UserLoginInfo) {
    const { loginId, loginPwd } = loginInfo;
    try {
      const data = await UserModel.findOne({
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

  public async updateUser(newAccountInfo: UserAttributes) {
    return await UserModel.update(newAccountInfo, {
      where: {
        loginId: newAccountInfo.loginId,
        id: newAccountInfo.id,
      },
    });
  }

  public async updateUserById(id: number, newAccountInfo: UserAttributes) {
    return await UserModel.update(newAccountInfo, {
      where: {
        id,
      },
    });
  }
  public async getUserList() {
    return await UserModel.findAll();
  }

  public async registerUser(accountInfo: UserAttributes) {
    return await UserModel.create(accountInfo);
  }

  public async findUser(loginId: string) {
    return await UserModel.findOne({
      where: { loginId },
    });
  }

  public async findUserById(id: number) {
    return await UserModel.findOne({
      where: { id },
    });
  }

  public async deleteUser(id: string) {
    return await UserModel.destroy({
      where: {
        id,
      },
    });
  }
}

const userDAO = UserDAO.getInstance();
export default userDAO;
