import createError from "http-errors";
import express, { ErrorRequestHandler } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { config } from "dotenv";

// import router
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

// server instance
const app = express();

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// router middleware
app.use("/", indexRouter);
app.use("/users", usersRouter);

// import sql
config();
import './dao/dbConnect';
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const errorHandle: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};
app.use(errorHandle);

export default app;
