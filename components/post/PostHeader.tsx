import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { useAuth } from "../../context/AuthContext";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { OptionButton, OptionsModal } from "../modals";
import { deletePost, followUser, UnfollowUser } from "../../firebase/service";

interface Props {
  userPhotoUrl: string;
  username: string;
  postId: string;
  userId: string;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

export const PostHeader: React.FC<Props> = ({
  userPhotoUrl = null,
  userId,
  username,
  postId,
  setIsOpen = () => {},
}) => {
  const { currentUser } = useAuth();
  const followings = currentUser?.followings!;

  const isFollowing = followings?.filter((f) => f.id === userId).length > 0;

  const router = useRouter();
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const isOwner = currentUser?.id === userId;

  const handleOnClick = async () => {
    const onClickEvents = async () => {
      isOwner
        ? await deletePost(postId).then(() => setDeletePostModalOpen(false))
        : isFollowing
        ? await UnfollowUser(
            { id: userId!, username: username },
            { id: currentUser?.id!, username: currentUser?.username! }
          )
        : await followUser(
            { id: userId!, username: username },
            { id: currentUser?.id!, username: currentUser?.username! }
          );

      setTimeout(() => {
        router.reload();
      }, 500);
    };

    if (router.query["pid"]) {
      // await onClickEvents().then(() => {
      //   Promise.all([
      //       setIsOpen(false),
      //       router.back(),
      //       setDeletePostModalOpen(false),
      //     ])
      // })
      setIsOpen(false);
      router.back();
      setTimeout(async () => {
        await onClickEvents();
      }, 300);
    } else {
      await onClickEvents();
    }

    // await onClickEvents()
    //   .then(() => {
    //     setTimeout(() => {
    //       router.reload();
    //     }, 500);
    //   });
  };

  return (
    <div className="h-[60px] min-h-[60px] border-b border-gray-200 flex items-center justify-between px-4 order-first">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push(`/${username}`)}
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-300 mr-2">
          <Image
            src={`${userPhotoUrl ? userPhotoUrl : "/icons/user.svg"}`}
            width={32}
            height={32}
            className="rounded-full"
            objectFit="cover"
          />
        </div>
        <span className="text-sm font-[500]">{username}</span>
      </div>
      {/* Delete post option modal */}
      <OptionsModal
        isOpen={deletePostModalOpen}
        setIsOpen={setDeletePostModalOpen}
      >
        <OptionButton
          title={isOwner ? "Delete" : isFollowing ? "Unfollow" : "Follow"}
          onClick={handleOnClick}
          textRed={!isOwner && !isFollowing ? false : true}
          fontBold={!isOwner && !isFollowing ? false : true}
        />
        <OptionButton
          title="Cancel"
          onClick={() => setDeletePostModalOpen(false)}
        />
      </OptionsModal>
      {/* */}

      <button onClick={() => setDeletePostModalOpen(true)}>
        <HiOutlineDotsHorizontal width={24} height={24} />
      </button>
    </div>
  );
};

export default PostHeader;
