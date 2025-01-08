import { SqlBaseAttributes } from "../common";

// 定义用户自定义属性接口
export interface UserAttributes extends SqlBaseAttributes {
  loginId: string;
  name: string;
  loginPwd: string;
  avatar?: string;
  permission?: number; // 暂时不需要权限
  enabled?: number;
}
