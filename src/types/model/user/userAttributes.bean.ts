import { SqlBaseAttributes } from "../common";

// 定义用户自定义属性接口
export interface UserAttributes extends SqlBaseAttributes {
  loginId: string; // 账号
  name: string; // 昵称
  loginPwd: string; // 密码
  avatar: string; // 头像
  permission?: number; // 暂时不需要权限
  mail?: string; // 邮箱
  qq?: string; // QQ
  wechat?: string; // 微信号
  github?: string; // 微信号
  intro?: string; // 个人介绍
  registerDate: number; // 注册时间
  lastLoginDate: number; // 上次登录事件
  points: number; // 积分
  enabled: number; // 是否可用
}
