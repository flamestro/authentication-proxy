import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const apiProxy = createProxyMiddleware({
  target: `${process.env.REDIRECT_URL}`,
});

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    apiProxy(req, res, next);
  }
}
