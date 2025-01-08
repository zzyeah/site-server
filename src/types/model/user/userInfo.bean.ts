import { UserAttributes } from "./userAttributes.bean";

// 后台用户信息
export type UserBEInfo = Omit<UserAttributes, "loginPwd">;

// 前台用户信息
export type UserInfo = Omit<UserAttributes, "loginPwd" | "permission">;

export type UserLoginInfo = Pick<
  UserAttributes,
  "id" | "loginId" | "name" | "enabled"
>;
