import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { useAuth } from "../../context/AuthContext";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { OptionButton, OptionsModal } from "../modals";
import { deletePost, UnfollowUser } from "../../firebase/service";

interface Props {
  userPhotoUrl: string;
  username: string;
  postId: string;
  userId: string;
}

export const PostHeader: React.FC<Props> = ({
  userPhotoUrl = null,
  userId,
  username,
  postId,
}) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const isOwner = currentUser?.id === userId;

  const handleOnClick = async () => {
    const onClickEvents = async () => {
      isOwner
        ? await deletePost(postId)
        : await UnfollowUser(
            { id: userId, username: username },
            { id: currentUser?.id!, username: currentUser?.username! }
          );
    };

    await onClickEvents()
      .then(() => {
        setDeletePostModalOpen(false);
      })
      .then(() =>
        setTimeout(() => {
          router.reload();
        }, 500)
      );

    // isOwner
    //   ? await deletePost(postId)
    //       .then(() => {
    //         setDeletePostModalOpen(false);
    //       })
    //       .then(() =>
    //         setTimeout(() => {
    //           router.reload();
    //         }, 500)
    //       )
    //   : await UnfollowUser(
    //       { id: userId, username: username },
    //       { id: currentUser?.id!, username: currentUser?.username! }
    //     )
    //       .then(() => {
    //         setDeletePostModalOpen(false);
    //       })
    //       .then(() =>
    //         setTimeout(() => {
    //           router.reload();
    //         }, 500)
    //       );
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
          title={isOwner ? "Delete" : "Unfollow"}
          onClick={handleOnClick}
          textRed
          fontBold
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
