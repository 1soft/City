export interface Task {
    _id?: { $oid: string };
    title: string;
    description: string;
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}