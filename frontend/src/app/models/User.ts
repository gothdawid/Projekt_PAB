import { Group } from "./Group"

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    groupId: number,
    Group: Group,
    createdAt: Date,
    updatedAt: Date,
    isTeacher: boolean
}