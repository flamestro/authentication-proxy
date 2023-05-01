import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { loginView } from "./view/loginView";
import { randomUUID } from "crypto";
import { tooManyAttemptsView } from "./view/tooManyAttemptsView";
import { noCredentialsConfiguredView } from "./view/noCredentialsConfiguredView";

const config = {
  ttlForTries: convertMinuteToMs(30),
  ttlForAuthorizedUsers: convertDaysToMs(30),
  maxLoginAttempts: 20,
  userName: process.env.USER_NAME,
  password: process.env.PASSWORD,
};

const authorizedUsers = [];
let loginAttempts = 0;

let nextCleanDateForTries = createDateInTheFuture(config.ttlForTries);
let nextCleanDateForAuthorizedUsers = createDateInTheFuture(config.ttlForAuthorizedUsers);

@Injectable()
export class AuthenticatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!config.password || !config.userName) {
      return res.send(noCredentialsConfiguredView);
    }
    if (isUserIdTTLExpired()) {
      cleanupKnownUserIds();
    }

    if (isLoginAttemptTTLExpired()) {
      cleanupAttempts();
    }

    const hasLoginAttemptsLeft = loginAttempts < config.maxLoginAttempts;

    const isAuthorizedViaHeader = req.headers["authorization"] === `Basic ${config.userName}:${config.password}`;

    const isAuthorizedViaCookie = req.cookies && req.cookies["authorization"] && authorizedUsers.includes(req.cookies["authorization"]);

    if (hasLoginAttemptsLeft && isAuthorizedViaHeader) {
      rememberUser(res);
      next();
    } else if (isAuthorizedViaCookie) {
      next();
    } else if (!hasLoginAttemptsLeft) {
      return res.send(tooManyAttemptsView(nextCleanDateForTries));
    } else {
      loginAttempts += 1;
      return res.send(loginView);
    }
  }
}

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs);
}

function clearAuthorizedUsersList() {
  while (authorizedUsers.length > 0) {
    authorizedUsers.pop();
  }
}

function isUserIdTTLExpired() {
  return nextCleanDateForAuthorizedUsers.getTime() <= new Date(Date.now()).getTime();
}

function cleanupKnownUserIds() {
  nextCleanDateForAuthorizedUsers = createDateInTheFuture(config.ttlForAuthorizedUsers);
  clearAuthorizedUsersList();
}

function isLoginAttemptTTLExpired() {
  return nextCleanDateForTries.getTime() <= new Date(Date.now()).getTime();
}

function cleanupAttempts() {
  nextCleanDateForTries = createDateInTheFuture(config.ttlForTries);
  loginAttempts = 0;
}

function rememberUser(res: Response) {
  const userId = randomUUID();
  authorizedUsers.push(userId);
  res.cookie("authorization", userId, {
    expires: nextCleanDateForAuthorizedUsers,
    httpOnly: true,
  });
}

function convertMinuteToMs(minutes: number) {
  return minutes * 60 * 1000;
}

function convertDaysToMs(days: number) {
  return days * 24 * convertMinuteToMs(60);
}
