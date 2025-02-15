import sequelize from "./dbConnect";
import AdminModel from "./admin/model/admin.model";
import { md5 } from "../utils/crypto";
import BannerModel from "./banner/model/banner.model";
import "./common/relationship";
import SettingModel from "./setting/model/setting.model";
import aboutModel from "./about/model/about.model";
import IssueModel from "./issue/model/issue.model";

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
        permission: 1,
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

    // 进行一些数据初始化
    const aboutCount = await aboutModel.count(); // 首先进行查询看有没有数据
    if (!aboutCount) {
      // 如果没有数据就进行初始化
      await aboutModel.create({
        url: "https://oss.duyiedu.com/demo-summary/网页简历/index.html",
      });
      console.log("初始化关于我数据...");
    }

    const settingCount = await SettingModel.count();
    if (!settingCount) {
      // 如果没有数据就进行初始化
      await SettingModel.create({
        avatar: "/static/images/avatar.jpeg",
        siteTitle: "我的个人空间",
        github: "zzyeah",
        qq: "541767316",
        qqQrCode: "/static/images/zuotian9652.jpg",
        weixin: "13760809972",
        weixinQrCode: "/static/images/zuotian9652.jpg",
        mail: "541767316@qq.com",
        icp: "黑ICP备17001719号",
        githubName: "zzyeah",
        favicon: "http://mdrs.yuanjin.tech/Fs4CDlC6mwe_WXLMIiXcmSJLHO4f",
      });
      console.log("初始化全局设置数据...");
    }

    const issueCount = await IssueModel.count();
    if (!issueCount) {
      try {
        await IssueModel.create({
          issueTitle: "关于我",
          issueContent:
            "我是一个前端工程师，现在正在学习React，同时也在研究Vue，希望自己能 eventually 成为全栈工程师。",
          issueDate: new Date().getTime(),
          issueStatus: true,
          typeId: 1,
          scanNumber: 0,
          commentNumber: 0,
          userId: 1,
        });
      } catch (error) {
        console.log(error);
      }
      console.log("create Issue init data");
    }

    console.log("数据库数据准备完毕");
  });
