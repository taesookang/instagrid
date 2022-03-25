import { ReactElement, useEffect } from "react";
import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";
import { PostCard, NoPosts } from "../components/post";
import { auth, db } from "../firebase";
import { IUserEssentials } from "../types";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { GetServerSideProps } from "next";

import nookies from "nookies";

import { verifyIdToken } from "../firebase/admin";
import { getPostsByUserId, getSuggestionsById } from "../firebase/service";
import { IPostWithUserData } from "../types/index";

import {
  doc,
  getDoc,
  // collection,
  // getDocs,
  // query,
  // where,
  // onSnapshot,
} from "firebase/firestore";
import { Suggested, SuggestedUser } from "../components/suggestions";
// import { getPostDataFromDoc,getPostsByUserId } from "../firebase/service";
// import { orderBy } from "firebase/firestore";

// I came up with two logics to render posts:
// (1) Serverside rendering (default)
// - doesn't support realtime update but UI is stable.
// (2) Listening to posts database
// - everytime something is changed in the post it renders the whole post list again, which occurs a blinking post card UI.

export default function Home({
  posts,
  suggestions,
}: {
  posts: IPostWithUserData[] | [];
  suggestions: IUserEssentials[] | [];
}) {
  // const [posts, setPosts] = useState<IPostWithUserData[]>([]);
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/accounts/login");
      }
    });
  }, [auth]);
  

  
  // useEffect(() => {
  //   if (currentUser) {
  //     const q = query(
  //       collection(db, "posts"),
  //       where("userId", "in", [currentUser.id, ...currentUser.followings.map((follower) => follower.id)]),
  //       orderBy("createdAt")
  //     );
  //     const unsubscribe = onSnapshot(q, (postSnapshot) => {
  //       postSnapshot.forEach(async (doc) => {
  //         const post = await getPostDataFromDoc(doc);
  //         setPosts((prev) => [post, ...prev.filter((p) => p.id !== post.id)]);
  //       })
  //     })

  //     return () => unsubscribe();
  //   }
  // }, [currentUser]);

  return (
    currentUser && (
      router.query["explore"] ?
      <Suggested suggestions={suggestions} />
      :
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
                <button className="capitalize text-xs font-[500]"
                  onClick={() => router.push({pathname:router.asPath, query: { explore: "people" }}, "/explore/people")}
                >
                  see all
                </button>
              </div>

              <div className="flex flex-col py-2">
                {suggestions?.slice(0,5).map((suggestedUser) => (
                  <SuggestedUser suggestedUser={suggestedUser} key={suggestedUser.id} />
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
  try {
    // parse & verify token cookie => get user id
    const cookies = nookies.get(ctx);
    if (cookies.token) {
      const verifiedToken = await verifyIdToken(cookies.token);
      const userId = verifiedToken.uid;

      // pull out user info from database.
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      // get posts from serverside

      const posts = await getPostsByUserId(userData?.id);

      // get suggestions

      const suggestions = await getSuggestionsById(userData?.id);
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
      suggestions: []
    },
  };
};
