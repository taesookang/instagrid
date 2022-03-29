import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// dependencies
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

// types
import { IPostWithUserData } from "../../types";

// firebase
import { getPostById } from "../../firebase/service";

// components
import { PostHeader } from "../post";
import { LikeButton } from "../buttons";
import { CommentList, CommentForm } from "../comments";
import { ModalPostCarousel } from ".";

interface Props {}

export const ModalPost: React.FC<Props> = () => {
  const [post, setPost] = useState<IPostWithUserData | null>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });


  useEffect(() => {
    !!router.query.pid ? setIsOpen(true) : setIsOpen(false);
  }, [router.query.pid]);
  const { pid } = router.query;

  const postId = pid as string;

  useEffect(() => {
    const getPost = async () => {
      const fetchedPost = await getPostById(postId);

      setPost(fetchedPost);
    };

    isOpen && getPost();
  }, [isOpen]);

  return (
    post &&
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false), setPost(null), router.back();
        router.replace(`${router.query.username}`, undefined, {
          shallow: true,
        });
      }}
      overlayClassName="modal-post__overlay"
      className={`modal-post w-full sm:aspect-[5/3] max-h-full min-h-[450px] max-w-[1240px] rounded-xl animate-scaleDown overflow-hidden transtion-all duration-300 ease-in-out flex flex-col sm:flex-row`}
    >
      <IoClose
        onClick={() => {
          setIsOpen(false), router.back();
        }}
        className="fixed top-4 right-4 text-white w-10 h-10 cursor-pointer"
      />
      {post && !isMobile ? (
        <ModalPostCarousel photos={post.photos} />
      ) : (
        <div className="h-full w-full flex items-center bg-gray-50" />
      )}
      <div className=" w-full h-full max-w-[500px] bg-white flex flex-col justify-between">
        <PostHeader
          userId={post?.userId!}
          userPhotoUrl={post?.userPhotoUrl!}
          username={post?.username!}
          postId={post?.id!}
          setIsOpen={setIsOpen}
        />
        {post && isMobile && <ModalPostCarousel photos={post.photos} />}
        <div className="w-full h-full overflow-y-scroll hidden sm:flex p-4 flex-col">
          <div className="flex min-h-fit w-full mt-4">
            <div className="relative min-w-[32px] min-h-[32px] w-8 h-8 overflow-hidden rounded-full mr-4">
              <Image
                src={`${
                  post?.userPhotoUrl ? post.userPhotoUrl : "/icons/user.svg"
                }`}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="flex flex-col w-full h-fit">
              <p className="text-sm">
                <span className="font-[500] hover:underline cursor-pointer">
                  {post?.username}
                </span>{" "}
                {post?.caption}
              </p>
              <div className="mt-2 mb-1 flex items-center min-h-[24px]">
                <span className="text-xs text-gray-400">
                  {moment(post?.createdAt).fromNow(true)}
                </span>
              </div>
            </div>
          </div>
          <CommentList postId={postId} type="modal" />
        </div>
        <div className="w-full h-2 bg-white sm:block hidden" />
        <div className="p-2 border-t border-gray-200">
          <LikeButton postId={postId} />
          <span className="uppercase text-[10px] text-gray-400 tracking-wider mx-2">
            {moment(post?.createdAt).format("MMMM, DD, YYYY")}
          </span>
        </div>
        <div className="w-full h-fit">
          <CommentForm postId={postId} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalPost;
