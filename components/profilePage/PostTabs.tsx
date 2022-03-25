import React from "react";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { GridTabIcon, SaveTabIcon } from "../icons/outlined";

interface Props {
  postsType: "posts" | "saved";
  setPostsType: React.Dispatch<React.SetStateAction<"posts" | "saved">>;
  isOwner: boolean;
}

export const PostTabs: React.FC<Props> = ({
  postsType,
  setPostsType,
  isOwner,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  return isMobile && !isOwner ? (
    <></>
  ) : (
    <div className="w-full border-t border-gray-200 grid grid-cols-2 sm:flex justify-center">
      <button
        className={`h-[54px] text-gray-400 -mt-[1px] flex items-center w-full justify-center sm:w-auto ${
          !isMobile && isOwner && "mr-[60px]"
        } ${
          postsType === "posts" &&
          !isMobile &&
          "border-t border-black text-basic-black"
        }`}
        onClick={() => setPostsType("posts")}
      >
        <GridTabIcon size={isMobile ? 18 : 14} color={`${postsType ==="posts" ? isMobile ? "#0096F6" : "#262626" : "rgb(156 163 175)"}`} /> 
        {!isMobile && <span className="uppercase text-xs ml-[6px] font-[600] tracking-[1px]">
          Posts
        </span>}
      </button>
      {isOwner && (
        <button
          className={`h-[54px] text-gray-400 -mt-[1px] flex items-center w-full justify-center sm:w-auto ${
            postsType === "saved" &&
            !isMobile &&
            "border-t border-black text-basic-black"
          }`}
          onClick={() => setPostsType("saved")}
        >
          {/* <Image src="/icons/bookmark.svg" width={12} height={12} /> */}
          <SaveTabIcon size={isMobile ? 18 : 14} color={`${postsType ==="saved" ? isMobile ? "#0096F6" : "#262626" : "rgb(156 163 175)"}`} />
          {!isMobile && <span className="uppercase text-xs ml-[6px] font-[600] tracking-[1px]">
            Saved
          </span>}
        </button>
      )}
    </div>
  );
};

export default PostTabs;
