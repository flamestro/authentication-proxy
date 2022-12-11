import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { loginView } from './view/loginView';
import { randomUUID } from 'crypto';
import { tooManyAttempts } from './view/tooManyAttempts';

const ttlForTries = 5 * 60 * 1000; // 5 mins
let nextCleanForTries = createDateInTheFuture(ttlForTries);
const ttlForAuthorizedUsersList = 20 * 60 * 1000; // 20 mins
const maxLoginAttempts = 20;
const authorizedUsers = [];
let loginAttempts = 0;
let nextCleanOfAuthorizedUsers = createDateInTheFuture(
  ttlForAuthorizedUsersList,
);

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs);
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
    const shouldCleanLoginAttempts =
      nextCleanForTries.getTime() <= new Date(Date.now()).getTime();
    if (shouldCleanLoginAttempts) {
      nextCleanForTries = createDateInTheFuture(ttlForTries);
      loginAttempts = 0;
    }
    if (
      loginAttempts < maxLoginAttempts &&
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
      loginAttempts < maxLoginAttempts &&
      req.cookies &&
      req.cookies['authorization'] &&
      authorizedUsers.includes(req.cookies['authorization'])
    ) {
      next();
    } else if (loginAttempts > maxLoginAttempts) {
      return res.send(tooManyAttempts);
    } else {
      loginAttempts += 1;
      return res.send(loginView);
    }
  }
}
