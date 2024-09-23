// captcha 模块业务逻辑层

import { create } from "svg-captcha";

class CaptchaService {
  public static instance: CaptchaService;

  public static getInstance() {
    if (!CaptchaService.instance)
      CaptchaService.instance = new CaptchaService();
    return CaptchaService.instance;
  }

  async getCaptcha() {
    return await create({
      size: 4,
      ignoreChars: "iI1lOo0",
      noise: 6,
      color: true,
    });
  }
}

const captchaService = CaptchaService.getInstance();
export default captchaService;
