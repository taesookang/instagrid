import { ReactElement, useEffect } from "react";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";
import { PostCard, NoPosts } from "../components/post";
import { auth, db } from "../firebase";
import { IUser, IPost, ISuggestedUser } from "../types";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import {
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";

import nookies from "nookies";

import { verifyIdToken } from "../firebase/admin";
import { getUserPhotoUrl, getPostsByUsername } from '../firebase/service';
import { IPostWithUserPhoto } from "../types/index";

export default function Home({
  posts,
  suggestions,
}: {
  posts: IPostWithUserPhoto[] | [];
  suggestions: ISuggestedUser[] | [];
}) {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/accounts/login");
      }
    });
  }, [auth]);

  const { currentUser } = useAuth();

  return (
    currentUser && (
      <>
        <div className="min-h-section h-full flex justify-center items-center">
          <Head>
            <title>Instagrid</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <section className="flex max-w-[935px] gap-7 justify-center">
            {/* post section */}
            <div className="flex flex-col min-h-full w-full max-w-[614px]">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard post={post} key={post.id} />)
              ) : (
                <NoPosts />
              )}
            </div>
            <div className="md:flex flex-col h-full min-w-[293px] sticky top-[60px] self-start pt-8 hidden">
              <div className="flex my-4 items-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200 mr-4 bg-gray-100">
                  <Image
                    src={
                      currentUser?.photoUrl
                        ? currentUser.photoUrl
                        : "/icons/user.svg"
                    }
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>
                <div className="flex flex-col h-[30px] justify-center text-sm">
                  <span className="text-gray-600 font-semibold">
                    {currentUser?.username}
                  </span>
                  <p className="text-gray-400 ">{currentUser?.excerpt}</p>
                </div>
              </div>

              <div className="mt-2 w-full flex items-center justify-between">
                <p className="capitalize text-gray-400 font-semibold tracking-wide text-sm">
                  Suggestions for you
                </p>
                <span className="capitalize text-xs font-[500] cursor-pointer">
                  see all
                </span>
              </div>

              <div className="flex flex-col py-2">
                {suggestions?.map((suggestedUser) => (
                  <div className="flex items-center justify-between w-full h-12 py-2 px-4">
                    <div className="relative min-w-[32px] w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 border border-gray-200">
                      <Image
                        src={
                          suggestedUser.photoUrl
                            ? suggestedUser.photoUrl
                            : "/icons/user.svg"
                        }
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <div className="flex flex-col h-full w-full justify-between">
                      <span className="text-sm leading-none">
                        {suggestedUser.username}
                      </span>
                      <p className="text-sm leading-none text-gray-400">
                        {suggestedUser.followers.length
                          ? `Followed by ${suggestedUser.followers[0]}`
                          : "No followers"}
                      </p>
                    </div>
                    <button
                      className="text-button-primary text-xs font-semibold tracking-wide"
                      onClick={() => {
                        updateDoc(doc(db, "users", suggestedUser.username), {
                          followers: arrayUnion(currentUser?.username),
                        });
                      }}
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </>
    )
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const suggestions: ISuggestedUser[] = [];
  try {
    // parse & verify token cookie => get user id
    const cookies = nookies.get(ctx);
    if (cookies.token) {
      const verifiedToken = await verifyIdToken(cookies.token);
      const userId = verifiedToken.uid;

      // get user info from database.
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      // get posts

      const posts = await getPostsByUsername(userData?.username)
      // const posts: IPostWithUserPhoto[] = [];

      // const postsRef = collection(db, "posts");
      // const postsQuery = query(
      //   postsRef,
      //   orderBy("createdAt", "desc"),
      //   where("username", "==", userData?.username)
      //   // where("userId", "array-contains", userData?.followings)
      // );
      // const postsSnapshot = await getDocs(postsQuery);
      // postsSnapshot.forEach(async (doc) => {
      //   const postData = doc.data();

      //   const userPhotoUrl = await getUserPhotoUrl(postData.username);

      //   const post: IPostWithUserPhoto = {
      //     id: postData.id,
      //     photos: postData.photos,
      //     likes: postData.likes,
      //     comments: postData.comments,
      //     createdAt: postData.createdAt,
      //     caption: postData.caption,
      //     userPhotoUrl: userPhotoUrl,
      //     username: postData.username,
      //   };
      //   posts.push(post);
      // });

      // get suggestions

      // const usersRef = collection(db, "users");
      // const usersQuery = query(
      //   usersRef,
      //   // orderBy("createdAt", "desc"),
      //   where("id", "not-in", userData?.followings)

      // );
      const usersRef = collection(db, "users");

      const usersQuery = query(usersRef, where("id", "!=", userData?.id));
      const querySnapshot = await getDocs(usersQuery);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user: ISuggestedUser = {
          id: data.id,
          username: data.username,
          photoUrl: data.photoUrl,
          followers: data.followers,
        };
        suggestions.push(user);
      });

      return {
        props: {
          posts: posts,
          suggestions: suggestions,
        },
      };
    }
  } catch (error: any | unknown) {
    console.log(error.message);
  }

  return {
    props: {
      posts: [],
    },
  };
};
