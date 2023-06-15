import { Collection, MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const mode = process.env.MODE;
const uri = process.env.MONGO_DB_URL;
const mongoDatabase = process.env.MONGO_DB_DATABASE;
const mongoCollection = process.env.MONGO_DB_COLLECTION;

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

interface State {
  _id: string;
  authorizedUsers: string[];
  loginAttempts: number;
  nextCleanDateForTries: Date;
  nextCleanDateForAuthorizedUsers: Date;
}

const initialState: State = {
  _id: "SINGLETON_STATE",
  authorizedUsers: [],
  loginAttempts: 0,
  nextCleanDateForTries: createDateInTheFuture(config.ttlForTries),
  nextCleanDateForAuthorizedUsers: createDateInTheFuture(config.ttlForAuthorizedUsers),
};

function createDateInTheFuture(futureMs: number) {
  return new Date(Date.now() + futureMs);
}

export class StateStore {
  private client: MongoClient;
  private collection: Collection<Document>;
  private inMemoryState: State;

  constructor() {
    if (mode === "MONGO") {
      this.client = new MongoClient(uri);
      this.collection = this.client.db(mongoDatabase).collection(mongoCollection);
    }
    this.inMemoryState = { ...initialState };
  }

  public async getState() {
    let result: State | undefined = undefined;
    if (mode === "MONGO") {
      result = ((await this.collection.findOne({ _id: "SINGLETON_STATE" } as any)) as unknown as State) || undefined;
      if (result === null) {
        await this.collection.insertOne(this.inMemoryState as any);
        result = this.inMemoryState;
      }
    } else {
      result = this.inMemoryState;
    }
    console.log(`Getting State. Mongo: ${mode === "MONGO"} ${JSON.stringify({ ...result, authorizedUsers: ["HIDDEN"] } as State)}`);
    return result;
  }

  public async updateState(state: State) {
    if (mode === "MONGO") {
      await this.collection.insertOne(state as any);
    } else {
      this.inMemoryState = state;
    }

    console.log(`Updating State. Mongo: ${mode === "MONGO"} ${JSON.stringify({ ...state, authorizedUsers: ["HIDDEN"] } as State)}`);
  }

  public async close() {
    await this.client.close();
  }
}
