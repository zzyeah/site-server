import { UserAttributes } from "src/dao/user/model/user.model";

export interface updateUserRequest extends Partial<UserAttributes> {
  name: string;
  loginId: string;
  loginPwd: string;
  oldLoginPwd: string;
}
