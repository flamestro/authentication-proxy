import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from "express";
import {createProxyMiddleware} from "http-proxy-middleware";


@Injectable()
export class AuthenticatorMiddleware implements NestMiddleware{
  use(req: Request, res: Response, next: NextFunction) {
    if(req.headers["x-auth"] === "ahmet") {
      next()
    } else {
      return res.send("You are not authorized! Stupid1")
    }
  }
}
