import { IStateStore, State } from "./model";
import { MongoStateStore } from "./mongoStateStore";
import { InMemoryStateStore } from "./inMemoryStateStore";

const mode = process.env.MODE;

export class StateStore implements IStateStore {
  private stateStore: IStateStore;

  constructor() {
    const preferringMongo = mode === "MONGO";
    if (preferringMongo) {
      try {
        this.stateStore = new MongoStateStore();
      } catch (e) {
        console.error("Failed to connect to mongo, falling back to inmemory solution", e);
        this.stateStore = new InMemoryStateStore();
      }
    } else {
      this.stateStore = new InMemoryStateStore();
    }
  }

  public async getState() {
    return await this.stateStore.getState().catch((reason) => {
      console.error("Error happend with current statestore on getState, switching to InMemory", reason);
      this.stateStore = new InMemoryStateStore();
      return this.stateStore.getState();
    });
  }

  public async updateState(state: State) {
    await this.stateStore.updateState(state).catch((reason) => {
      console.error("Error happend with current statestore on updateState, switching to InMemory", reason);
      this.stateStore = new InMemoryStateStore();
      return this.stateStore.updateState(state);
    });
  }
}
