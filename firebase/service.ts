import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./";
import { IPostWithUserPhoto, IUser } from "../types";

const postsRef = collection(db, "posts");

export const getUserPhotoUrl = async (username: string) => {
//   let userPhotoUrl = null;
//   const userDoc = doc(db, "users", );
//   const userSnapshot = await getDoc(userDoc);
//   const data = userSnapshot.data();
//   if (userSnapshot.exists()) {
//     userPhotoUrl = data?.photoUrl!;
//   }
    const user = await getUserByUsername(username)

    const userPhotoUrl = user.photoUrl

  return userPhotoUrl;
};

export const getUserByUsername = async (username: string) => {
  const userCache: IUser[] = [];
  const usersRef = collection(db, "users");
  const usersQuery = query(usersRef, where("username", "==", username));
  const userSnapshot = await getDocs(usersQuery);
  userSnapshot.forEach((doc) => {
    const userData = doc.data();
    const user: IUser = {
      id: userData?.id,
      email: userData?.email,
      username: userData?.username,
      excerpt: userData?.excerpt,
      photoUrl: userData?.photoUrl,
      followers: userData?.followers,
      followings: userData?.followings,
    };
    userCache.push(user);
  });
  const user = userCache[0];

  return user;
};

export const getPostDataFromDoc = async (
  doc: DocumentSnapshot | QueryDocumentSnapshot
) => {
  const data = doc.data();
  const userPhotoUrl = await getUserPhotoUrl(data?.username);
  const post: IPostWithUserPhoto = {
    id: data?.id,
    photos: data?.photos,
    likes: data?.likes,
    comments: data?.likes,
    createdAt: data?.createdAt,
    caption: data?.caption,
    username: data?.username,
    userPhotoUrl: userPhotoUrl,
  };

  return post;
};

export const getPostsByUsername = async (username: string) => {
  const posts: IPostWithUserPhoto[] = [];
  const q = query(
    postsRef,
    where("username", "==", username),
    orderBy("createdAt", "desc")
  );

  const postsSnapshot = await getDocs(q);

  postsSnapshot.forEach(async (doc) => {
    const post = await getPostDataFromDoc(doc);
    posts.push(post);
  });

  return posts;
};

export const getPostById = async (postId: string) => {
  const postDoc = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postDoc);

  const post = await getPostDataFromDoc(postSnapshot);

  return post;
};

export const deleteComment = async (commentId: string, postId: string) => {
  const commentDoc = doc(db, "comments", commentId);
  const postDoc = doc(db, "posts", postId);
  await deleteDoc(commentDoc).then(() => {
    updateDoc(postDoc, {
      comments: arrayRemove(commentId),
    });
  });
};

export const deletePost = async (postId: string) => {
  const postDoc = doc(db, "posts", postId);
  await deleteDoc(postDoc);
};
