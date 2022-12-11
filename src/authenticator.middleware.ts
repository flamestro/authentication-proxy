import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { loginView } from './view/loginView';
import { randomUUID } from 'crypto';
import { tooManyAttemptsView } from './view/tooManyAttemptsView';

// General config
const ttlForTries = 5 * 60 * 1000; // 5 mins
const ttlForAuthorizedUsers = 20 * 60 * 1000; // 20 mins
const maxLoginAttempts = 20;

// hacky way of remembering users and login attempts
const authorizedUsers = [];
let loginAttempts = 0;

let nextCleanDateForTries = createDateInTheFuture(ttlForTries);
let nextCleanDateForAuthorizedUsers = createDateInTheFuture(
  ttlForAuthorizedUsers,
);

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs);
}

function clearAuthorizedUsersList() {
  while (authorizedUsers.length > 0) {
    authorizedUsers.pop();
  }
}

function conditionalUserIdCleanup() {
  const shouldCleanAuthorizedUsers =
    nextCleanDateForAuthorizedUsers.getTime() <= new Date(Date.now()).getTime();

  if (shouldCleanAuthorizedUsers) {
    nextCleanDateForAuthorizedUsers = createDateInTheFuture(
      ttlForAuthorizedUsers,
    );
    clearAuthorizedUsersList();
  }
}

function conditionalLoginAttemptCleanup() {
  const shouldCleanLoginAttempts =
    nextCleanDateForTries.getTime() <= new Date(Date.now()).getTime();

  if (shouldCleanLoginAttempts) {
    nextCleanDateForTries = createDateInTheFuture(ttlForTries);
    loginAttempts = 0;
  }
}

function conditionalUserIdAndAttemptCleanup() {
  conditionalUserIdCleanup();
  conditionalLoginAttemptCleanup();
}

function rememberUser(res: Response) {
  const userId = randomUUID();
  authorizedUsers.push(userId);
  res.cookie('authorization', userId, {
    maxAge: 600000,
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  });
}

@Injectable()
export class AuthenticatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    conditionalUserIdAndAttemptCleanup();

    const hasLoginAttemptsLeft = loginAttempts < maxLoginAttempts;

    const isAuthorizedViaHeader =
      req.headers['authorization'] ===
      `Basic ${process.env.USER_NAME}:${process.env.PASSWORD}`;

    const isAuthorizedViaCookie =
      req.cookies &&
      req.cookies['authorization'] &&
      authorizedUsers.includes(req.cookies['authorization']);

    if (hasLoginAttemptsLeft && isAuthorizedViaHeader) {
      rememberUser(res);
      next();
    } else if (hasLoginAttemptsLeft && isAuthorizedViaCookie) {
      next();
    } else if (!hasLoginAttemptsLeft) {
      return res.send(tooManyAttemptsView);
    } else {
      loginAttempts += 1;
      return res.send(loginView);
    }
  }
}
