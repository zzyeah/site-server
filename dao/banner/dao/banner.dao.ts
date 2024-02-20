import { LoginInfo } from "../../../types";
import BannerModel, { BannerAttributes } from "../model/banner.model";

// login
export class BannerDAO {
  public static instance: BannerDAO = new BannerDAO();

  public static getInstance() {
    if (!BannerDAO.instance) BannerDAO.instance = new BannerDAO();
    return BannerDAO.instance;
  }

  async findBanner() {
    return await BannerModel.findAll();
  }

  async updateBanner(banners: BannerAttributes[]) {
    await BannerModel.destroy({ truncate: true });
    await BannerModel.bulkCreate(banners);
    return await BannerModel.findAll();
  }
}

const bannerDAO = BannerDAO.getInstance();
export default bannerDAO;
