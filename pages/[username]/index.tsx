import React, { ReactElement } from "react";
import { Layout } from "../../components/layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

import { useAuth } from "../../context/AuthContext";

import { db } from "../../firebase";
import { getUserPhotoUrl, getUserByUsername } from "../../firebase/service";
import { collection, getDocs, query, where } from "firebase/firestore";
import { IPost, IPostWithUserPhoto, IUser } from "../../types/index";
import { HeartIconFill, ChatIconFill } from "../../components/icons/fill";

export const ProfilePage = ({
  posts,
  user,
}: {
  posts: IPostWithUserPhoto[];
  user: IUser;
}) => {
  const { currentUser } = useAuth();
  const isOwner = user.username === currentUser?.username;

  const router = useRouter();

  console.log(posts);
  

  return (
    <div className="w-full min-h-full">
      <div className="w-full max-w-[935px] mx-auto px-[20px] mt-[30px]">
        <div className="w-full min-h-[150px] flex mb-11">
          <div className="w-1/3 h-full flex items-center justify-center">
            <div className="relative w-[150px] h-[150px] border border-gray-300 rounded-full bg-gray-100 overflow-hidden">
              <Image
                src={user.photoUrl ? user.photoUrl : "/icons/user.svg"}
                layout="fill"
              />
            </div>
          </div>
          <div className="w-2/3 h-full flex flex-col">
            <div className="h-10 flex items-center mb-5">
              <span className=" text-[28px] font-[300] tracking-normal">
                {user.username}
              </span>
              <button className=" ml-5 text-sm font-[500] px-[9px] py-[5px] border border-gray-300 rounded-md">
                Edit Profile
              </button>
              <button className="ml-[5px] w-10 h-10 p-2">
                <Image src="/icons/setting.svg" width={24} height={24} />
              </button>
            </div>
            <div className="h-6 flex items-center text-[16px] tracking-normal mb-5">
              <p className="mr-10">
                <span className="font-[500]">{posts.length}</span> posts
              </p>
              <p className="mr-10">
                <span className="font-[500]">{user.followers.length}</span>{" "}
                followers
              </p>
              <p className="">
                <span className="font-[500]">{user.followings.length}</span>{" "}
                following
              </p>
            </div>

            <div className="w-full ">
              <span className="text-[16px] font-[500] tracking-normal">
                {user.excerpt}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-200 flex justify-center">
          <div className="h-[54px] -mt-[1px] flex items-center mr-[60px] border-t border-black">
            <Image src="/icons/grid.svg" width={12} height={12} />
            <span className="uppercase text-xs ml-[6px] font-[600] tracking-[1px]">
              Posts
            </span>
          </div>
          <div className="h-[54px] flex items-center">
            <Image src="/icons/bookmark.svg" width={12} height={12} />
            <span className="uppercase text-xs ml-[6px] font-[600] tracking-[1px]">
              Saved
            </span>
          </div>
        </div>
        <div className="w-full h-full grid gap-[3px] sm:gap-7 grid-cols-3">
          {posts.map((post) => (
            <Link
              href={{pathname: router.asPath , query: {pid:post.id}}}
              shallow
              key={post.id}
            >
              <a
                className="aspect-square relative cursor-pointer"
                key={post.id}
                // onClick={() => {
                //   router.push(router.asPath + `/?p=${post.id}`, undefined, { shallow: true})
                // }}
              >
                <div className="absolute w-full h-full bg-black/20 flex items-center justify-center z-10 hover:opacity-100 opacity-0 ">
                  <div className="flex text-white font-bold mr-[30px]">
                    <HeartIconFill
                      width={19}
                      height={19}
                      color="white"
                      className="mt-[2px] mr-[7px]"
                    />
                    {post.likes.length}
                  </div>
                  <div className="flex text-white font-bold">
                    <ChatIconFill
                      width={19}
                      height={19}
                      color="white"
                      className="mt-[2px] mr-[7px]"
                    />
                    {post.comments.length}
                  </div>
                </div>
                <Image
                  src={post.photos[0]}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
                {post.photos.length > 1 && (
                  <div className="absolute top-0 right-0 m-2 z-20">
                    <Image src="/icons/layer.svg" width={22} height={22} />
                  </div>
                )}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const usernames: string[] = [];
  const usersCollection = collection(db, "users");
  // const postsCollection = collection(db, "posts")
  const userSnapshot = await getDocs(usersCollection);
  // const postSnapshot = await getDocs(postsCollection);

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

  // Get posts by username
  const posts: IPostWithUserPhoto[] = [];
  const postsRef = collection(db, "posts");
  const postsQuery = query(postsRef, where("username", "==", params?.username));
  const postsSnapshots = await getDocs(postsQuery);

  postsSnapshots.forEach(async (doc) => {
    const data = doc.data();
    const userPhotoUrl = await getUserPhotoUrl(data.username)
    
    const post: IPostWithUserPhoto = {
      id: data.id,
      photos: data.photos,
      likes: data.likes,
      comments: data.comments,
      createdAt: data.createdAt,
      caption: data.caption,
      username: data.username,
      userPhotoUrl: userPhotoUrl,
    };

    posts.push(post);
  });

  // Get user data by username

  const user: IUser = await getUserByUsername(params!.username as string)

  // const userCache: IUser[] = [];
  // const usersRef = collection(db, "users");
  // const usersQuery = query(usersRef, where("username", "==", params?.username));
  // const userSnapshot = await getDocs(usersQuery);

  // userSnapshot.forEach((doc) => {
  //   const data = doc.data();

    // const user: IUser = {
    //   email: userData?.email,
    //   username: userData?.username,
    //   excerpt: userData?.excerpt,
    //   photoUrl: userData?.photoUrl,
    //   followers: userData?.followers,
    //   followings: userData?.followings,
    // };
  //   userCache.push(user);
  // });
  // const user = userCache[0];

  return { props: { posts, user } };
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProfilePage;
