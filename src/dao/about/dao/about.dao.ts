import { SqlModelInstance } from "../../../types";
import { NotFoundError } from "../../../utils";
import AboutModel, { AboutAttributes } from "../model/about.model";

// setting
export class AboutDAO {
  public static instance: AboutDAO = new AboutDAO();

  public static getInstance() {
    if (!AboutDAO.instance) AboutDAO.instance = new AboutDAO();
    return AboutDAO.instance;
  }

  async findSetting(): Promise<SqlModelInstance<AboutAttributes>> {
    const data = await AboutModel.findOne();
    if (!data) throw new NotFoundError("setting data not found");
    return data;
  }

  async updateSetting(newAboutInfo: Partial<AboutAttributes>) {
    await AboutModel.update(newAboutInfo, {
      where: {
        id: 1,
      },
    });
    return this.findSetting();
  }
}

const aboutDAO = AboutDAO.getInstance();
export default aboutDAO;
