import { UserAttributes, UserLoginRequest } from "../../../types";
import UserModel from "../model/user.model";

// login
export class UserDAO {
  public static instance: UserDAO = new UserDAO();

  public static getInstance() {
    if (!UserDAO.instance) UserDAO.instance = new UserDAO();
    return UserDAO.instance;
  }

  public async login(loginInfo: UserLoginRequest) {
    const { loginId, loginPwd } = loginInfo;
    try {
      const data = await UserModel.findOne({
        attributes: { exclude: ["loginPwd"] },
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

  public async updateUserById(id: string, newAccountInfo: UserAttributes) {
    return await UserModel.update(newAccountInfo, {
      where: {
        id,
      },
    });
  }
  public async getUserList() {
    return await UserModel.findAll({
      attributes: { exclude: ["loginPwd"] },
    });
  }

  public async registerUser(accountInfo: UserAttributes) {
    return await UserModel.create(accountInfo);
  }

  public async findUser(loginId: string) {
    return await UserModel.findOne({
      attributes: { exclude: ["loginPwd"] },
      where: { loginId },
    });
  }

  public async findUserById(id: string) {
    return await UserModel.findOne({
      attributes: { exclude: ["loginPwd"] },
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

  public async findUserByPointsRank() {
    return await UserModel.findAll({
      attributes: ["id", "name", "points", "avatar"],
      limit: 10,
      order: [["points", "DESC"]],
    });
  }

  public async findUserPasswordById(id: string) {
    return await UserModel.findOne({
      attributes: { include: ["loginPwd"] },
      where: { id },
    });
  }
}

const userDAO = UserDAO.getInstance();
export default userDAO;
