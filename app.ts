import { config } from "dotenv";
config();
import "express-async-errors";
import createError from "http-errors";
import express, { ErrorRequestHandler } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

// import sql
import "./dao/db";

// import router
import adminRouter from "./routes/api/admin/admin.api";
import bannerRouter from "./routes/api/banner/banner.api";
import captchaRouter from "./routes/api/captcha/captcha.api";
import { expressjwt } from "express-jwt";
import { md5 } from "./utils/crypto";
import ServiceError, { ForbiddenError, UnknownError } from "./utils/errors";

// server instance
export const app = express();

import session from "express-session";
import uploadRouter from "./routes/api/upload/upload.api";
import blogTypeRouter from "./routes/api/blogType/blogType.api";
import blogRouter from "./routes/api/blog/blog.api";
import demoRouter from "./routes/api/demo/demo.api";
import messageRouter from "./routes/api/message/message.api";
app.use(
  session({
    secret: process.env.SESSION_SECRECT!,
    resave: true,
    saveUninitialized: true,
  })
);

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressjwt({
    secret: md5(process.env.JWT_SECRECT!),
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: "/api/admin/login", methods: ["POST"] },
      { url: "/res/captcha", methods: ["GET"] },
      { url: "/api/banner", methods: ["GET"] },
      { url: "/api/blogtype", methods: ["GET"] },
      { url: "/api/blog", methods: ["GET"] },
      { url: /\/api\/blog\/\d/, methods: ["GET"] },
      { url: "/api/project", methods: ["GET"] },
      { url: "/api/message", methods: ["GET", "POST"] },
      { url: "/api/comment", methods: ["GET", "POST"] },
    ],
  })
);
// router middleware
app.use("/api/admin", adminRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blogtype", blogTypeRouter);
app.use("/api/blog", blogRouter);
app.use("/api/project", demoRouter);
app.use("/res/captcha", captchaRouter);
app.use("/api/message", messageRouter);
app.use("/api/comment", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const errorHandle: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    if (err.name === "UnauthorizedError") {
      res.send(new ForbiddenError("未登陆，或者登陆过期").toResponseJSON());
    } else if (err instanceof ServiceError) {
      res.send(err.toResponseJSON());
    } else {
      res.send(new UnknownError("未知错误").toResponseJSON());
    }
  }
};
app.use(errorHandle);
