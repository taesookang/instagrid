import React, { ReactElement, useState } from "react";
import Head from "next/head";

// context
import { useAuth } from "../../context/AuthContext";

// firebase
import { db } from "../../firebase";
import { getUserByUsername } from "../../firebase/service";
import { collection, getDocs } from "firebase/firestore";

// components
import { Layout } from "../../components/layout";
import { PostGrid, PostTabs, ProfileInfo } from "../../components/profilePage";

// types
import { IUser } from "../../types/index";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

export const ProfilePage = ({ user }: { user: IUser }) => {
  const { currentUser } = useAuth();

  const [postsType, setPostsType] = useState<"posts" | "saved">("posts");
  const isOwner = user.username === currentUser?.username;
  return (
    <>
      <Head>
        <title>
          {user.excerpt
            ? user.excerpt + "(@" + user.username + ")"
            : "@" + user.username}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full min-h-full">
        <div className="w-full max-w-[935px] mx-auto mt-4 sm:px-[20px] sm:mt-[30px]">
          <ProfileInfo user={user} isOwner={isOwner} />
          <PostTabs
            postsType={postsType}
            setPostsType={setPostsType}
            isOwner={isOwner}
          />
          <PostGrid user={user} postsType={postsType} />
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const usernames: string[] = [];
  const usersCollection = collection(db, "users");
  const userSnapshot = await getDocs(usersCollection);

  userSnapshot.forEach((doc) => {
    usernames.push(doc.data().username);
  });

  const paths = usernames.map((username) => ({
    params: { username: username },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  // Get user data by username
  const user: IUser = await getUserByUsername(params!.username as string);

  return { props: { user } };
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProfilePage;
