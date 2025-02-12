import express, { Express, RequestHandler } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors, { CorsOptions } from "cors";
import * as dotenv from "dotenv";
import MainRoutes from "./app/routes/mainRoutes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import helmet from "helmet";
import logger from "morgan";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { JwtPayload } from "jsonwebtoken";
dotenv.config();

const app: Express = express();
app.set("trust proxy", true);

const logTime = () => {
  const time = new Date();
  return time.toString().slice(0, 24);
};
const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // methods: '*',
};
const options: RequestHandler[] = [
  cors(corsOptions),
  cookieParser(),
  helmet(),
  logger(function (tokens, req, res) {
    return [
      tokens.method(req, res)?.blue,
      tokens.url(req, res)?.cyan,
      Number(tokens.status(req, res)) === 200
        ? tokens.status(req, res)?.green
        : tokens.status(req, res)?.red ?? "",
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      "/",
      logTime(),
    ].join(" ");
  }),
  express.json({ limit: "50mb" }),
  express.urlencoded({ extended: true }),
];

app.use(...options);
// make session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "",
      clientSecret: "",
      callbackURL: "http://localhost:5000/api/v1/auth/login/google/callback",
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user: JwtPayload, done) => {
  done(null, user);
});

passport.deserializeUser((obj: never, done) => {
  done(null, obj);
});
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", MainRoutes);

app.get("/", (req, res) => {
  res.send("welcome to the server");
});

app.use(globalErrorHandler);

export default app;
