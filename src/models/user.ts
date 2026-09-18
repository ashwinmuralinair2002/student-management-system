import type { UserData } from "../interfaces/user.interface.js";

export abstract class User {
  private readonly id: string;
  protected name: string;
  protected email: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public updateContactDetails(name: string, email: string): void {
    this.name = name;
    this.email = email;
  }

  public abstract getRoleDescription(): string;
}
