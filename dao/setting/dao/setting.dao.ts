import { SqlModelInstance } from "../../../types";
import { NotFoundError } from "../../../utils";
import SettingModel, { SettingAttributes } from "../model/setting.model";

// setting
export class SettingDAO {
  public static instance: SettingDAO = new SettingDAO();

  public static getInstance() {
    if (!SettingDAO.instance) SettingDAO.instance = new SettingDAO();
    return SettingDAO.instance;
  }

  async findSetting(): Promise<SqlModelInstance<SettingAttributes>> {
    const data = await SettingModel.findOne();
    if (!data) throw new NotFoundError("setting data not found");
    return data;
  }

  async updateSetting(newSettingInfo: Partial<SettingAttributes>) {
    await SettingModel.update(newSettingInfo, {
      where: {
        id: 1,
      },
    });
    return this.findSetting();
  }
}

const settingDAO = SettingDAO.getInstance();
export default settingDAO;
