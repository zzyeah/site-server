export interface AdminLoginInfo {
  loginId: string;
  loginPwd: string;
  captcha?: string;
  remember?: number | string;
}
