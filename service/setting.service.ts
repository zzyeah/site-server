// 全局设置模块业务逻辑层

import settingDAO from "../dao/setting/dao/setting.dao";
import { SettingAttributes } from "../dao/setting/model/setting.model";

class SettingService {
  public static instance: SettingService;

  public static getInstance() {
    if (!SettingService.instance)
      SettingService.instance = new SettingService();
    return SettingService.instance;
  }

  // 获取全局设置
  async findSetting() {
    const { dataValues } = await settingDAO.findSetting();
    return dataValues;
  }

  // 修改全局设置
  async updateSetting(data: Partial<SettingAttributes>) {
    const { dataValues } = await settingDAO.updateSetting(data);
    return dataValues;
  }
}

const settingService = SettingService.getInstance();
export default settingService;
