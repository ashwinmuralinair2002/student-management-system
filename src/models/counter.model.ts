import { model, Schema } from "mongoose";

export interface CounterDatabaseData {
  name: string;
  lastIssuedRollNumber: number;
}

const counterSchema = new Schema<CounterDatabaseData>({
  name: { type: String, required: true, unique: true },
  lastIssuedRollNumber: { type: Number, required: true },
});

export const CounterModel = model<CounterDatabaseData>("Counter", counterSchema);
