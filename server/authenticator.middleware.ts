import { NextFunction, Request, Response } from "express";
import { loginView } from "../src/view/Login/loginView";
import { randomUUID } from "crypto";
import { tooManyAttemptsView } from "../src/view/ErrorPages/TooManyAttempts/tooManyAttemptsView";
import { noCredentialsConfiguredView } from "../src/view/ErrorPages/noCredentialsConfiguredView";
import * as dotenv from "dotenv";
import { StateStore } from "./store/stateStore";
dotenv.config();

const config = {
  maxLoginAttempts: 20,
  userName: process.env.USER_NAME!,
  password: process.env.PASSWORD!,
  ttlForTries: convertMinuteToMs(15),
  ttlForAuthorizedUsers: convertDaysToMs(30),
};

const stateStore = new StateStore();

export const authenticatorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const state = await stateStore.getState();
  if (!config.password || !config.userName) {
    return res.send(noCredentialsConfiguredView);
  }
  if (isUserIdTTLExpired(state)) {
    console.log("Cleaning UserId's");
    cleanupKnownUserIds(state);
  }

  if (isLoginAttemptTTLExpired(state)) {
    console.log("Cleaning Attempts");
    cleanupAttempts(state);
  }

  console.log("Login attempted");
  const hasLoginAttemptsLeft = state.loginAttempts < config.maxLoginAttempts;

  const isAuthorizedViaHeader = req.headers["authorization"] === `Basic ${config.userName}:${config.password}`;

  const isAuthorizedViaCookie = req.cookies && req.cookies["authorization"] && state.authorizedUsers.includes(req.cookies["authorization"]);

  if (hasLoginAttemptsLeft && isAuthorizedViaHeader) {
    console.log("Successful Login");
    rememberUser(res, state);
    await stateStore.updateState(state);
    next();
  } else if (isAuthorizedViaCookie) {
    console.log("Authorized user enters the proxy");
    next();
  } else if (!hasLoginAttemptsLeft) {
    console.log("Too many failed attempts");
    return res.send(tooManyAttemptsView(new Date(state.nextCleanDateForTries)));
  } else {
    state.loginAttempts += 1;
    await stateStore.updateState(state);
    return res.send(loginView);
  }
};

function clearAuthorizedUsersList(state) {
  while (state.authorizedUsers.length > 0) {
    state.authorizedUsers.pop();
  }
}

function isUserIdTTLExpired(state) {
  return state.nextCleanDateForAuthorizedUsers.getTime() <= new Date(Date.now()).getTime();
}

function cleanupKnownUserIds(state) {
  state.nextCleanDateForAuthorizedUsers = createDateInTheFuture(config.ttlForAuthorizedUsers);
  clearAuthorizedUsersList(state);
}

function cleanupAttempts(state) {
  state.nextCleanDateForTries = createDateInTheFuture(config.ttlForTries);
  state.loginAttempts = 0;
}

function isLoginAttemptTTLExpired(state) {
  return state.nextCleanDateForTries.getTime() <= new Date(Date.now()).getTime();
}

function rememberUser(res: Response, state) {
  const userId = randomUUID();
  state.authorizedUsers.push(userId);
  res.cookie("authorization", userId, {
    expires: state.nextCleanDateForAuthorizedUsers,
    httpOnly: true,
  });
}

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs);
}

function convertMinuteToMs(minutes: number) {
  return minutes * 60 * 1000;
}

function convertDaysToMs(days: number) {
  return days * 24 * convertMinuteToMs(60);
}
