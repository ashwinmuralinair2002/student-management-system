export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface AdminData extends UserData {
  department: string;
}
