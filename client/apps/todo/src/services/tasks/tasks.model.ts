
export interface ITask {
  _id: string;
  title?: string;
  description: string;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}