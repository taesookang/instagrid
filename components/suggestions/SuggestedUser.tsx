import React from "react";
import Image from "next/image";
import { useRouter } from 'next/router'
import { IUserEssentials } from "../../types";
import { FollowButton } from '.'

interface Props {
  suggestedUser: IUserEssentials;
}

export const SuggestedUser: React.FC<Props> = ({ suggestedUser }) => {
  const router = useRouter()

  const handleOnClick = () => {
    router.push(`/${suggestedUser.username}`)
  }

  return (
    <div
      className="flex items-center justify-between w-full h-12 py-2"
      key={suggestedUser.id}
    >
      <div className="relative min-w-[32px] w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 border border-gray-200 cursor-pointer"
        onClick={handleOnClick}
      >
        <Image
          src={
            suggestedUser.photoUrl ? suggestedUser.photoUrl : "/icons/user.svg"
          }
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="flex flex-col h-full w-full justify-between">
        <span className="text-sm leading-none hover:underline cursor-pointer" onClick={handleOnClick}>{suggestedUser.username}</span>
        <p className="text-xs leading-none text-gray-400">
          {suggestedUser.followers.length
            ? `Followed by ${suggestedUser.followers[0].username} ${suggestedUser.followers[1] ? "+" + (suggestedUser.followers.length - 1) + " more" : ""}`
            : "No followers"}
        </p>
      </div>
      {/* <FollowButton user={suggestedUser} type="suggestion" /> */}
      <FollowButton suggestedUser={suggestedUser} />
    </div>
  );
};

export default SuggestedUser;
