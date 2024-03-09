// project 模块业务逻辑层

import validate from "validate.js";
import demoDAO from "../dao/demo/dao/demo.dao";
import { Constraints, Demo, DemoAttributes, DemoCommonInfo } from "../types";
import {
  NotFoundError,
  UploadError,
  ValidationError,
  array2String,
  string2Array,
} from "../utils";

class DemoService {
  public static instance: DemoService;

  public static getInstance() {
    if (!DemoService.instance) DemoService.instance = new DemoService();
    return DemoService.instance;
  }

  async findAllDemo() {
    const demo = await demoDAO.findAllDemo();
    const result: DemoAttributes[] = [];
    demo.forEach((item) => {
      result.push(string2Array(item.dataValues, ["description"]));
    });
    return result;
  }

  async addDemo(newDemoInfo: Demo) {
    const demoInfo = array2String<DemoCommonInfo, Demo, DemoAttributes>(
      newDemoInfo,
      ["description"]
    );

    // 验证规则
    const demoRule: Constraints = {
      name: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      url: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      github: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      description: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
      order: {
        presence: {
          allowEmpty: false,
        },
        type: "integer",
      },
      thumb: {
        presence: {
          allowEmpty: false,
        },
        type: "string",
      },
    };
    // 数据验证
    try {
      await validate.async(demoInfo, demoRule);

      const demo = await demoDAO.addDemo(demoInfo);
      return [demo.dataValues];
    } catch (error) {
      throw new ValidationError("数据验证失败");
    }
  }

  async updateDemo(id: string, demoInfo: Partial<Demo>): Promise<Demo> {
    const demoAttr = array2String<DemoCommonInfo, Demo, DemoAttributes>(
      demoInfo,
      ["description"]
    );
    const data = await demoDAO.updateDemo(id, demoAttr);
    if (data) {
      const demo = string2Array<DemoCommonInfo, DemoAttributes, Demo>(
        data.dataValues,
        ["description"]
      );
      return demo;
    }
    throw new NotFoundError("未找到对应项目");
  }

  // 删除项目
  async deleteDemo(id: string) {
    const data = await demoDAO.deleteDemo(id);
    return data;
  }
}

const demoService = DemoService.getInstance();
export default demoService;
