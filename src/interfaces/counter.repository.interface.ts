export interface ICounterRepository {
  getNextRollNumber(): Promise<number>;
}
