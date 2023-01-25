export interface Message {
    id: number,
    receiverId: number,
    senderId: number,
    text: string,
    receiver: Receiver,
    createdAt: Date,
    updatedAt: Date
}

interface Receiver {
    id: number,
    firstName: string,
    lastName: string,
    isTeacher: boolean
}