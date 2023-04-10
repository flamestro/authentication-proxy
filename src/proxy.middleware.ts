import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const REDIRECT_URL = process.env.REDIRECT_URL;

export const apiProxy = createProxyMiddleware({
  target: `${REDIRECT_URL}`,
});

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    apiProxy(req, res, next);
  }
}
