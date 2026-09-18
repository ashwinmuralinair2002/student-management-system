import { CounterModel } from "../models/counter.model.js";
import type { ICounterRepository } from "../interfaces/counter.repository.interface.js";

export class CounterRepository implements ICounterRepository {
  public async getNextRollNumber(): Promise<number> {
    await CounterModel.init();

    const counter = await CounterModel.findOneAndUpdate(
      { name: "studentRollNumber" },
      { $inc: { lastIssuedRollNumber: 1 } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: false },
    );

    if (counter === null) {
      throw new Error("Could not create the roll number counter");
    }

    return counter.lastIssuedRollNumber;
  }
}
