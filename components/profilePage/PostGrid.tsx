import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { CameraOutlined } from "../../components/icons/outlined";

import { getPostsByUsername, getSavedByUsername } from "../../firebase/service";
import { IPostWithUserData, IUser } from "../../types";

import { TailSpin } from "react-loader-spinner";
import ThumbnailOverlay from "./ThumbnailOverlay";

interface Props {
  user: IUser;
  postsType: "posts" | "saved";
}

export const PostGrid: React.FC<Props> = ({ user, postsType }) => {
  const [posts, setPosts] = useState<IPostWithUserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { username } = router.query

  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      let fetchedPosts =
        postsType === "posts"
          ? await getPostsByUsername(user?.username)
          : await getSavedByUsername(user.username);
      setTimeout(() => {
        setPosts(fetchedPosts);
        setIsLoading(false);
      }, 400);
    };
    user.username && getPosts();
  }, [postsType, username]);
  return (
    <>
      {postsType === "saved" && !isLoading && posts.length > 0 && (
        <div className="text-xs text-gray-400 mb-2">
          {" "}
          Only you can see what you've saved{" "}
        </div>
      )}
      <div
        className={`w-full h-full sm:p-0 ${
          isLoading || posts.length === 0 ? "flex" : "grid"
        } gap-[3px] sm:gap-7 grid-cols-3`}
      >
        {isLoading ? (
          <div className="w-full flex justify-center items-center mt-4">
            <TailSpin height={36} width={36} color="#b4b4b4" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link
              href={{ pathname: router.asPath, query: { pid: post.id } }}
              shallow
              key={post.id}
            >
              <a
                className="aspect-square relative cursor-pointer"
                key={post.id}
              >
                <ThumbnailOverlay postId={post.id} />
                <Image
                  src={post.photos[0].url}
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
          ))
        ) : (
          <div className="w-full h-56 mt-4 flex flex-col items-center justify-center">
            <CameraOutlined
              size={38}
              color="#b4b4b4"
              className="p-2 rounded-full border-2 border-[#b4b4b4]"
            />
            <p className="mt-2 text-[#b4b4b4]">No Posts</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PostGrid;
