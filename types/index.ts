
export interface IUser {
    id: string
    username: string
    email: string
    excerpt: string | null
    photoUrl: string | null
    followers: Follower[]
    followings: Follower[]
}

export declare type Follower = {id: IUser["id"], username: IUser["username"]}

export interface IUserEssentials {
    id: IUser["id"]
    username: IUser["username"]
    followers: Follower[]
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
    savedBy: IUser[] | []
    comments: IComment["id"][] | []
    createdAt: number
    caption: string | null
    userId: IUser["id"]
}

export interface IPostWithUserData extends IPost {
    username: IUser["username"]
    userPhotoUrl: IUser["photoUrl"]
}

export interface ISearchedUser {
    photoUrl: string;
    username: string;
    excerpt?: string;
  }