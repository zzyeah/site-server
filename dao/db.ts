import sequelize from "./dbConnect";
import AdminModel from "./admin/model/admin.model";
import { md5 } from "../utils/crypto";
import BannerModel from "./banner/model/banner.model";

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

    // banner initial
    const bannerCount = await BannerModel.count();
    if (!bannerCount) {
      await BannerModel.bulkCreate([
        {
          midImg: "/static/images/bg1_mid.jpg",
          bigImg: "/static/images/bg1_big.jpg",
          title: "塞尔达旷野之息",
          description: "2017年年度游戏，期待续作",
        },
        {
          midImg: "/static/images/bg2_mid.jpg",
          bigImg: "/static/images/bg2_big.jpg",
          title: "塞尔达四英杰",
          description: "四英杰里面你最喜欢的又是谁呢",
        },
        {
          midImg: "/static/images/bg3_mid.jpg",
          bigImg: "/static/images/bg3_big.jpeg",
          title: "日本街道",
          description: "动漫中经常出现的日本农村街道，一份独特的恬静",
        },
      ]);
      console.log("初始化首页标语数据...");
    }

    console.log("数据库数据准备完毕");
  });
