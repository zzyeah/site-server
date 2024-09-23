import { SqlBaseAttributes } from "../common";

// 定义用户自定义属性接口
export interface DemoAttributes extends DemoCommonInfo {
  description: string;
}
export interface DemoCommonInfo extends SqlBaseAttributes {
  name: string;
  url: string;
  github: string;
  thumb: string;
  order: number;
}

export interface Demo extends DemoCommonInfo {
  description: string[];
}
