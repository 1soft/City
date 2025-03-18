import { Task } from "./task.model.ts";

export interface WebSocketWithUsername extends WebSocket {
  email?: string;
}

export interface TaskUpdateEvent {
  type:  "added" | "deleted" | "edited" | "statusChanged" | "update-users";
  email: string;
  task: Task;
  users: string[];
}

export interface MessageData extends Omit<TaskUpdateEvent, "email" |  "users">{
}

export interface EventData {
  token: string;
  data: TaskUpdateEvent;
}