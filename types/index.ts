
export interface IUser {
    id: string
    username: string
    email: string
    excerpt: string | null
    photoUrl: string | null
    followers: IUser["id"][] | []
    followings: IUser["id"][] | []
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

export interface IPhoto {
    name: string
    url: string
}

export interface IPost {
    id: string
    photos: IPhoto[]
    likes: IUser[] | []
    comments: IComment["id"][] | []
    createdAt: number
    caption: string | null
    userId: IUser["id"]
}

export interface IPostWithUserData extends IPost {
    username: IUser["username"]
    userPhotoUrl: IUser["photoUrl"]
}





