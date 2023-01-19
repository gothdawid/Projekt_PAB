import { User } from "./User";

export interface Subject {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    teacherId: number,
    Teacher: User,
}