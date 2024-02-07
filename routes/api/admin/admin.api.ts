import express from "express";
import adminService from "../../../service/admin.service";

const adminRouter = express.Router();

/* GET home page. */
adminRouter.post("/login", async function (req, res, next) {
  // 首先验证验证码

  // 假设验证码通过
  const loginInfo = req.body;
  const result = await adminService.login(loginInfo);
  console.log(result);
});

export default adminRouter;
