export interface User {
  _id?: { $oid: string };
  email: string;
  password: string;
}