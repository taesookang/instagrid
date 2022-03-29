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
  arrayUnion,
} from "firebase/firestore";
import { db, storage, auth } from "./";
import {
  IPostWithUserData,
  IUser,
  IPhoto,
  ISearchedUser,
  IUserEssentials,
} from "../types";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { Follower, IComment } from "../types/index";

const postsRef = collection(db, "posts");
const usersRef = collection(db, "users");

export const getPostUserData = async (id: string) => {
  const user = await getUserById(id);

  const username = user?.username;
  const photoUrl = user?.photoUrl;

  return { username, photoUrl };
};

export const getUserById = async (id: string) => {
  const userDoc = doc(db, "users", id);
  const userSnapshot = await getDoc(userDoc);
  const user = getUserDataFromDoc(userSnapshot);

  return user;
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

export const getUserDataFromDoc = (
  doc: DocumentSnapshot | QueryDocumentSnapshot
) => {
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

  return user;
};

export const getPostDataFromDoc = async (
  doc: DocumentSnapshot | QueryDocumentSnapshot
) => {
  const data = doc.data();
  const { username, photoUrl } = await getPostUserData(data?.userId);
  const post: IPostWithUserData = {
    id: data?.id,
    photos: data?.photos,
    likes: data?.likes,
    savedBy: data?.savedBy,
    comments: data?.comments,
    createdAt: data?.createdAt,
    caption: data?.caption,
    userId: data?.userId,
    username: username,
    userPhotoUrl: photoUrl,
  };

  return post;
};

export const getPostsByUsername = async (username: string) => {
  const posts: IPostWithUserData[] = [];

  const user = await getUserByUsername(username);
  const q = query(
    postsRef,
    where("userId", "==", user?.id!),
    orderBy("createdAt", "desc")
  );

  const postsSnapshot = await getDocs(q);

  postsSnapshot.forEach(async (doc) => {
    const post = await getPostDataFromDoc(doc);
    posts.push(post);
  });

  return posts;
};

export const getPostsLengthById = async (id: string) => {
  const posts: any[] = [];
  const q = query(postsRef, where("userId", "==", id));
  const snapshot = await getDocs(q);

  snapshot.forEach((item) => {
    posts.push(item.data());
  });

  return posts.length;
};
export const getPostsByUserId = async (id: string) => {
  const posts: IPostWithUserData[] = [];

  const user = await getUserById(id);

  const q = query(
    postsRef,
    where("userId", "in", [id, ...user.followings.map((f) => f.id)]),
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
  const post = await getDoc(postDoc);
  const photos = post.data()?.photos;
  const comments = post.data()?.comments;

  photos.forEach((photo: IPhoto) => {
    const imagesRef = ref(storage, `images/${photo.name}`);
    deleteObject(imagesRef);
  });

  comments.forEach(async (comment: string) => {
    await deleteComment(comment, postId);
  });

  await deleteDoc(postDoc);
};

export const UnfollowUser = async (
  profileUser: { id: string; username: string },
  currentUser: { id: string; username: string }
) => {
  const currentUserDoc = doc(db, "users", currentUser.id);
  const profileUserDoc = doc(db, "users", profileUser.id);

  updateDoc(currentUserDoc, {
    followings: arrayRemove({
      id: profileUser.id,
      username: profileUser.username,
    }),
  }).then(async () => {
    updateDoc(profileUserDoc, {
      followers: arrayRemove({
        id: currentUser.id,
        username: currentUser.username,
      }),
    });
  });
};

export const followUser = async (
  profileUser: Follower,
  currentUser: Follower
) => {
  const currentUserDoc = doc(db, "users", currentUser.id);
  const profileUserDoc = doc(db, "users", profileUser.id);

  updateDoc(currentUserDoc, {
    followings: arrayUnion({
      id: profileUser.id,
      username: profileUser.username,
    }),
  }).then(async () => {
    updateDoc(profileUserDoc, {
      followers: arrayUnion({
        id: currentUser.id,
        username: currentUser.username,
      }),
    });
  });
};

export const updatePhotoUrl = async (file: File) => {
  const currentUser = auth?.currentUser!;

  const storageRef = ref(storage, `avatar`);
  const fileRef = ref(storage, `avatar/${currentUser.uid}`);
  const userDoc = doc(db, "users", currentUser.uid);

  const items = await listAll(storageRef);
  const isExist =
    items.items.filter((elem) => elem.name === currentUser.uid).length > 0;

  const uploadProcess = async () => {
    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        await updateProfile(currentUser!, {
          photoURL: url,
        });
        await updateDoc(userDoc, {
          photoUrl: url,
        });
      });
    });
  };

  if (isExist) {
    deleteObject(fileRef).then(() => {
      uploadProcess();
    });
  } else {
    uploadProcess();
  }
};

export const getUsersBySearch = async (term: string) => {
  const users: ISearchedUser[] = [];

  const q = query(
    usersRef,
    where("username", ">=", term),
    where("username", "<=", term + "\uf7ff")
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const user: ISearchedUser = {
      username: data.username,
      photoUrl: data.photoUrl,
      excerpt: data.excerpt,
    };

    users.push(user);
  });

  return users;
};

export const getSuggestionsById = async (id: string) => {
  const suggestions: IUserEssentials[] = [];

  const userDoc = doc(db, "users", id);
  const userSnapshot = await getDoc(userDoc);
  const user = getUserDataFromDoc(userSnapshot);

  const usersQuery = query(usersRef, where("id", "!=", id));
  const querySnapshot = await getDocs(usersQuery);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const user: IUserEssentials = {
      id: data.id,
      username: data.username,
      photoUrl: data.photoUrl,
      followers: data.followers,
    };
    suggestions.push(user);
  });

  const results = suggestions.filter(
    (s) => !user.followings.map((x) => x.id).includes(s.id)
  );
  results.sort((a, b) => b.followers.length - a.followers.length);

  return results;
};

export const getSavedByUsername = async (username: string) => {
  const posts: IPostWithUserData[] = [];

  const user = await getUserByUsername(username);
  const q = query(
    postsRef,
    where("savedBy", "array-contains", user?.id!),
    orderBy("createdAt", "desc")
  );

  const postsSnapshot = await getDocs(q);

  postsSnapshot.forEach(async (doc) => {
    const post = await getPostDataFromDoc(doc);
    posts.push(post);
  });

  return posts;
};
