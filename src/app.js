// Package Modules
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import nunjucks from "nunjucks";
import dotenv from "dotenv";
import passport from "passport";

// Custom Moudules
import { router as pageRouter } from "./api/routes/page.js";
import { router as authRouter } from "./api/routes/auth.js";
import { router as userRouter } from "./api/routes/user.js";
import { router as postRouter } from "./api/routes/post.js";
import { sequelize } from "./api/models/index.js";
import passportConfig from "./api/passport/index.js";

dotenv.config();

export const app = express();
passportConfig(); // 패스포트 설정
app.set("port", process.env.PORT || 8001);
app.set("view engine", "html");
nunjucks.configure("./src/client/views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "/src/client/public")));
app.use("/img", express.static(path.join(__dirname, "uploads"))); // img라우터를 uploads 폴더로 연결
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize()); // req객체에 passport 설정을 심는다.
app.use(passport.session()); // req.session 객체는 express-session 에서 생성하기에 express-session 미들웨어보다 뒤에 연결

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});
