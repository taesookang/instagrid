import React from "react";
import { IComment } from "../../types";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface Props {
  comment: IComment;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedComment: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Comment: React.FC<Props> = ({
  comment,
  setModalOpen,
  setSelectedComment,
}) => {
  const router = useRouter();
  const { currentUser } = useAuth();
  
  return (
    <div className="comment flex min-h-fit w-full mt-4">
      <div className="relative min-w-[32px] min-h-[32px] w-8 h-8 overflow-hidden rounded-full mr-4">
        <Image
          src={comment.userPhotoUrl!}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="text-sm">
          <span
            className="font-[500] hover:underline cursor-pointer"
            onClick={() => router.push(comment.userId)}
          >
            {comment.username}
          </span>{" "}
          {comment.value}
        </p>
        <div className="mt-2 mb-1 flex items-center min-h-[24px] h-fit">
          <span className="text-xs text-gray-400">
            {moment(comment.createdAt).fromNow(true)}
          </span>
          {currentUser?.id === comment.userId && (
            <button
              className="comment__menu ml-2"
              onClick={() => {
                setModalOpen(true);
                setSelectedComment(comment.id);
              }}
            >
              <HiOutlineDotsHorizontal size={24} color={"#9CA3AF"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
