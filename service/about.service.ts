// 关于我模块业务逻辑层

import aboutDAO from "../dao/about/dao/about.dao";
import { AboutAttributes } from "../dao/about/model/about.model";

class AboutService {
  public static instance: AboutService;

  public static getInstance() {
    if (!AboutService.instance) AboutService.instance = new AboutService();
    return AboutService.instance;
  }

  // 获取全局设置
  async findAbout() {
    const { dataValues } = await aboutDAO.findSetting();
    return dataValues;
  }

  // 修改全局设置
  async updateAbout(data: Partial<AboutAttributes>) {
    const { dataValues } = await aboutDAO.updateSetting(data);
    return dataValues;
  }
}

const aboutService = AboutService.getInstance();
export default aboutService;
