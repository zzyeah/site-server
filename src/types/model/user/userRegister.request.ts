export interface UserRegisterRequest {
  loginId: string;
  loginPwd: string;
  name: string;
  captcha: string;
  avatar?: string;
  enabled?: number;
}
