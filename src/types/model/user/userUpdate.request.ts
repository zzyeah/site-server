import { UserAttributes } from "./userAttributes.bean";

export interface updateUserRequest extends Partial<UserAttributes> {
  name: string;
  loginId: string;
  loginPwd: string;
  oldLoginPwd: string;
}
