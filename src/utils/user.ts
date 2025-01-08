import { UserAttributes, UserInfo, UserLoginInfo } from "../types";

export function transferUserInfo(userSqlAttributes: UserAttributes): UserInfo {
  const { loginPwd, permission, ...result } = userSqlAttributes;
  return result;
}

export function transferUserLoginInfo(
  userSqlAttributes: UserAttributes
): UserLoginInfo {
  const { loginPwd, permission, ...result } = userSqlAttributes;
  return result;
}
