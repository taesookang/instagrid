import React, {  useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { IPostWithUserData, IUser } from "../../types/index";
import { useRouter } from "next/router";
import {  getPostsByUsername } from "../../firebase/service";


import { HeartIconFill, ChatIconFill } from "../../components/icons/fill";


interface Props {
    username: string
}

export const Posts: React.FC<Props> = ({ username }) => {
  const [postsType, setPostsType] = useState<"posts" | "saved">("posts");
  const [posts, setPosts] = useState<IPostWithUserData[] | []>([]);
  const router = useRouter();
  
   useEffect(() => {
    const getPosts = async () => {
      if (postsType !== "saved") {
        const fetchedPosts = await getPostsByUsername(username);
        setPosts(fetchedPosts);
      }
    };
    getPosts();
  }, [postsType]);
    return (
        <>
        {posts &&
            posts.map((post) => (
              <Link
                href={{ pathname: router.asPath, query: { pid: post.id } }}
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
                        size={19}
                        color="white"
                        className="mt-[2px] mr-[7px]"
                      />
                      {post.likes.length}
                    </div>
                    <div className="flex text-white font-bold">
                      <ChatIconFill
                        size={19}
                        color="white"
                        className="mt-[2px] mr-[7px]"
                      />
                      {post.comments.length}
                    </div>
                  </div>
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
            ))}
            </>
    );
}

export default Posts;