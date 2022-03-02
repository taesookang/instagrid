
export interface IUser {
    id: string
    username: string
    email: string
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
    username: IUser["username"]
    userPhotoUrl: IUser["photoUrl"]
    value: string
    createdAt: number
}


export interface IPost {
    id: string
    photos: string[] 
    likes: IUser[] | []
    comments: IComment["id"][] | []
    createdAt: number
    caption: string | null
    username: IUser["username"]
}

export interface IPostWithUserPhoto extends IPost {
    userPhotoUrl: string | null
}




