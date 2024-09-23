import express from "express";
import captchaService from "../../../service/captcha.service";

const captchaRouter = express.Router();

captchaRouter.get("/", async (req, res, next) => {
  try {
    // 生成验证码
    const captcha = await captchaService.getCaptcha();
    req.session["captcha"] = captcha.text;
    // 设置响应头
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(captcha.data);
  } catch (error) {
    next(error);
  }
});

export default captchaRouter;
