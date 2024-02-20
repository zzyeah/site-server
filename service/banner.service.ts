// banner 模块业务逻辑层

import bannerDAO from "../dao/banner/dao/banner.dao";
import { BannerAttributes } from "../dao/banner/model/banner.model";

class BannerService {
  public static instance: BannerService;

  public static getInstance() {
    if (!BannerService.instance) BannerService.instance = new BannerService();
    return BannerService.instance;
  }

  async findBanner() {
    const data = await bannerDAO.findBanner();
    return data;
  }

  async updateBanner(banners:BannerAttributes[]) {
    const data = await bannerDAO.updateBanner(banners);
    return data;
  }
}

const bannerService = BannerService.getInstance();
export default bannerService;
