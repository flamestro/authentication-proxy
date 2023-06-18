import * as dotenv from "dotenv";
dotenv.config();

function convertMinuteToMs(minutes: number) {
  return minutes * 60 * 1000;
}

function convertDaysToMs(days: number) {
  return days * 24 * convertMinuteToMs(60);
}

const config = {
  ttlForTries: convertMinuteToMs(30),
  ttlForAuthorizedUsers: convertDaysToMs(30),
};

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs);
}

export interface State {
  _id: string;
  authorizedUsers: string[];
  loginAttempts: number;
  nextCleanDateForTries: Date;
  nextCleanDateForAuthorizedUsers: Date;
}

export interface IStateStore {
  getState: () => Promise<State>;
  updateState: (state: State) => Promise<void>;
}

export const initialState: State = {
  _id: "SINGLETON_STATE",
  authorizedUsers: [],
  loginAttempts: 0,
  nextCleanDateForTries: createDateInTheFuture(config.ttlForTries),
  nextCleanDateForAuthorizedUsers: createDateInTheFuture(config.ttlForAuthorizedUsers),
};
