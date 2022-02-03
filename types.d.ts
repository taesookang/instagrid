
type User = {
    email: string | null!
    username: string | null!
    excerpt?: string | null
    photoUrl?: string | null
    followers?: User[] | []
    followings?: User[] | []
}



type Like = {
    id: string!
    postId: string!
    by: User!
    createdAt: Date
}

type Comment = {
    id: string!
    postId: string!
    by: User!
    value: string!
    createdAt: Date
}

type Post = {
    id: string!
    userId: string! | undefined
    photos: string[] | []
    likes: Like[] | []
    comments: Comment[] | []
    createAt: number
    caption: string | null
}


export {User, Photo, Like, Comment, Post}