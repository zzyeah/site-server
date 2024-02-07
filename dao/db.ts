import sequelize from "./dbConnect";
import AdminModel from "./admin/model/admin.model";
import { md5 } from "../utils/crypto";

// 初始化数据库
sequelize
  .sync({ alter: true })
  .then(async () => {
    // 同步完成后，部分表需要初始化数据
    // 需查询表是否有数据，有则不初始化
    console.log("数据库同步完毕");
  })
  .catch((err) => {
    // sqlLogger.error("数据库同步出错: ", err);
    console.log(err);
  })
  .finally(async () => {
    const adminCount = await AdminModel.count();
    if (!adminCount) {
      // 没有数据，进行初始化操作
      await AdminModel.create({
        loginId: "zy",
        name: "administrator",
        loginPwd: md5("123456"),
      });
      console.log("初始化管理员信息完毕", md5("123"));
    }
    console.log("数据库数据准备完毕");
  });
