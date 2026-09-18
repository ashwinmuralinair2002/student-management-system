import type { AdminData } from "../interfaces/user.interface.js";
import { User } from "./user.js";

export class Admin extends User {
  private department: string;

  constructor(data: AdminData) {
    super(data);
    this.department = data.department;
  }

  public getRoleDescription(): string {
    return `Admin: manages the ${this.department} department`;
  }

  public getDepartment(): string {
    return this.department;
  }

  public updateDepartment(department: string): void {
    this.department = department;
  }
}
