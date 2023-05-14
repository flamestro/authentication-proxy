import * as cookieParser from "cookie-parser";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { authenticatorMiddleware } from "./authenticator.middleware";
import * as dotenv from "dotenv";
import * as express from "express";

const REDIRECT_URL = process.env.REDIRECT_URL!;
const PORT = 80;

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(authenticatorMiddleware);
app.use(proxy({ target: `${REDIRECT_URL}` }));

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
