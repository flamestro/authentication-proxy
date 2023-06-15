import * as cookieParser from "cookie-parser";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { authenticatorMiddleware } from "./authenticator.middleware";
import * as dotenv from "dotenv";
import * as express from "express";

dotenv.config();

const REDIRECT_URL = process.env.REDIRECT_URL!;
const PORT = 80;

const app = express();

app.use(cookieParser());
app.use(authenticatorMiddleware);
app.use(proxy({ target: `${REDIRECT_URL}`, logger: console }));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT} redirecting to ${REDIRECT_URL}`);
});
