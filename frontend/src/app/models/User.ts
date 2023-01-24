import { Group } from "./Group"

export interface User {
    id: number,
    first_name: string,
    last_name: string,
    address: string,
    city: string,
    groupId: number,
    Group: Group,
    createdAt: Date,
    updatedAt: Date,
    isTeacher: boolean
}