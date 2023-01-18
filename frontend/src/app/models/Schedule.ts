import { Day } from "./Day";
import { Room } from "./Room";
import { Subject } from "./Subject";

export interface Schedule {    
    id: number,
    day: Day,
    time: Date,
    subjectId: number,
    Subject: Subject[],
    group_id: number,
    room_id: number,
    Room: Room,
    createdAt: Date,
    updatedAt: Date
}