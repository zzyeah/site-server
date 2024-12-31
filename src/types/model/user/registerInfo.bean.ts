export interface UserRegisterInfo {
  loginId: string;
  loginPwd: string;
  name: string;
  captcha: string;
  avatar?: string;
  enabled?: number;
}
