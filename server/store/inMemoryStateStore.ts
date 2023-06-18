import { initialState, IStateStore, State } from "./model";

export class InMemoryStateStore implements IStateStore {
  private state: State;
  private usingMongo = false;

  constructor() {
    console.log(`initializing statestore in InMemory mode`);
    this.state = { ...initialState };
  }

  public async getState() {
    console.log(`Getting State. Mongo: ${this.usingMongo} ${JSON.stringify({ ...this.state, authorizedUsers: ["HIDDEN"] } as State)}`);
    return this.state;
  }

  public async updateState(state: State) {
    this.state = state;

    console.log(`Updating State. Mode: InMemory ${JSON.stringify({ ...state, authorizedUsers: ["HIDDEN"] } as State)}`);
  }
}
