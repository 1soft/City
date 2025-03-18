import { ITask } from "./tasks.model";

export const tasksEvents = {
    added: "added",
    edited: "edited",
    deleted: "deleted",
    statusChanged: "statusChanged",
    usersUpdated: "usersUpdated"
} as const;

export type OpType  = keyof typeof tasksEvents;

export interface IMessage { 
    type: OpType; 
    email: string; 
    task: ITask;
    users?: string[];
}