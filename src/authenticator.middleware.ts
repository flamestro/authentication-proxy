import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { loginView } from './view/loginView';
import { randomUUID } from 'crypto';

const ttlForAuthorizedUsersList = 1200000; // 20 mins
const authorizedUsers = [];
let nextCleanOfAuthorizedUsers = createDateInTheFuture(
  ttlForAuthorizedUsersList,
);

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs,);
}

function clearAuthorizedUsersList() {
  while (authorizedUsers.length > 0) {
    authorizedUsers.pop();
  }
}

@Injectable()
export class AuthenticatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const shouldCleanAuthorizedUsers =
      nextCleanOfAuthorizedUsers.getTime() <= new Date(Date.now()).getTime();
    if (shouldCleanAuthorizedUsers) {
      nextCleanOfAuthorizedUsers = createDateInTheFuture(
        ttlForAuthorizedUsersList,
      );
      clearAuthorizedUsersList();
    }
    if (
      req.headers['authorization'] ===
      `Basic ${process.env.USER_NAME}:${process.env.PASSWORD}`
    ) {
      const userId = randomUUID();
      authorizedUsers.push(userId);
      res.cookie('authorization', userId, {
        maxAge: 600000,
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });
      next();
    } else if (
      req.cookies &&
      req.cookies['authorization'] &&
      authorizedUsers.includes(req.cookies['authorization'])
    ) {
      next();
    } else {
      return res.send(loginView);
    }
  }
}
