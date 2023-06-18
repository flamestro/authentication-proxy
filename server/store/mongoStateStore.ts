import { Collection, MongoClient } from "mongodb";
import { initialState, IStateStore, State } from "./model";

const uri = process.env.MONGO_DB_URL;
const mongoDatabase = process.env.MONGO_DB_DATABASE;
const mongoCollection = process.env.MONGO_DB_COLLECTION;

export class MongoStateStore implements IStateStore {
  private client: MongoClient;
  private collection: Collection<Document>;

  constructor() {
    console.log(`initializing statestore in Mongo mode`);
    this.client = new MongoClient(uri);
    this.collection = this.client.db(mongoDatabase).collection(mongoCollection);
  }

  public async getState() {
    let result: State | undefined;
    result = ((await this.collection.findOne({ _id: "SINGLETON_STATE" } as any)) as unknown as State) || undefined;
    if (!result) {
      await this.collection.insertOne(initialState as any);
      result = initialState;
    }
    console.log(`Getting State. Mongo Mode ${JSON.stringify({ ...result, authorizedUsers: ["HIDDEN"] } as State)}`);
    return result;
  }

  public async updateState(state: State) {
    await this.collection.updateOne({ _id: state._id } as any, { $set: state }, { upsert: true });
    console.log(`Updating State. Mode Mongo ${JSON.stringify({ ...state, authorizedUsers: ["HIDDEN"] } as State)}`);
  }
}
