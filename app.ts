import { config } from "dotenv";
config();
import createError from "http-errors";
import express, { ErrorRequestHandler } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

// import sql
import "./dao/db";

// import router
import adminRouter from "./routes/api/admin/admin.api";
import { expressjwt } from "express-jwt";
import { md5 } from "./utils/crypto";
import { ForbiddenError, UnknownError } from "./utils/errors";

// server instance
export const app = express();

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
    path: [{ url: "/api/admin/login", methods: ["POST"] }],
  })
);
// router middleware
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const errorHandle: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    switch (err.name) {
      case "UnauthorizedError":
        res.send(new ForbiddenError("未登陆，或者登陆过期").toResponseJSON());
        break;

      default:
        res.send(new UnknownError("未知错误").toResponseJSON());
        break;
    }
  }
};
app.use(errorHandle);
