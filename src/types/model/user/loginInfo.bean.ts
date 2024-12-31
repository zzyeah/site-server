export interface UserLoginInfo {
  loginId: string;
  loginPwd: string;
  captcha?: string;
  remember?: number | string;
}
