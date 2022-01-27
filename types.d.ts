import { Date } from "mongoose"

type User = {
    id: string!
    email: string | null!
    username: string | null!
    photoUrl?: string | null
    followers?: User[]
    followings?: User[]
}

type Photo = {
    id: string!
    userId: string!
    url: string!
    createdAt: Date
}


export {User, Photo}