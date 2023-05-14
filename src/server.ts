import * as cookieParser from "cookie-parser";
import { createProxyMiddleware as proxy } from "http-proxy-middleware";
import { authenticatorMiddleware } from "./authenticator.middleware";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require("express");

const REDIRECT_URL = "http://localhost:3000/";
const app = express();
const port = 80;

app.use(cookieParser());
app.use(authenticatorMiddleware);
app.use(proxy({ target: `${REDIRECT_URL}` }));

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
