
export interface IUser {
    id: string
    email: string
    username: string
    excerpt: string | null
    photoUrl: string | null
    followers: IUser[] | []
    followings: IUser[] | []
}

export interface ISuggestedUser {
    id: IUser["id"]
    username: IUser["username"]
    followers: IUser["followers"]
    photoUrl: IUser["photoUrl"]
}


export interface IComment {
    id: string
    postId: IPost["id"]
    userId: IUser["id"]
    username: IUser["username"]
    userPhotoUrl: IUser["photoUrl"]
    value: string
    createdAt: number
}

export interface IPost {
    id: string
    userId: string
    userPhotoUrl: string
    username: string
    photos: string[] 
    likes: IUser[] | []
    comments: IComment["id"][] | []
    createdAt: number
    caption: string | null
}


