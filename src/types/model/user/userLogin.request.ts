export interface UserLoginRequest {
  loginId: string;
  loginPwd: string;
  captcha?: string;
  remember?: number | string;
}
