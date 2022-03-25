import React, { useState } from "react";
import Image from "next/image";
import { UserIcon } from "../icons/fill";
import { BsCheck2 } from "react-icons/bs";
import { OptionsModal, OptionButton } from "../modals";
import { IUserEssentials } from "../../types";

import { useAuth } from "../../context/AuthContext";
import { followUser, UnfollowUser } from "../../firebase/service";

interface Props {
  user: IUserEssentials;
  type: "profile" | "suggestion";
}

export const FollowButton: React.FC<Props> = ({ user }) => {
  const { currentUser } = useAuth();
  const followings = currentUser?.followings!;
  const [isFollowing, setIsFollowing] = useState(
    followings?.filter((f) => f.id === user.id).length > 0
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFollowClick = async () => {
    await followUser(
      { id: user.id, username: user.username },
      { id: currentUser?.id!, username: currentUser?.username! }
    ).then(() => {
      setIsFollowing(true);
      setMenuOpen(false);
    });
  };

  const handleUnfollowClick = async () => {
    await UnfollowUser(
      { id: user.id, username: user.username },
      { id: currentUser?.id!, username: currentUser?.username! }
    ).then(() => {
      setIsFollowing(false);
    });
  };

  switch (isFollowing) {
    case true:
      return (
        currentUser && (
          <>
            <button
              className="h-[30px] w-full max-w-[250px] sm:w-auto px-6 justify-center border border-gray-300 text-white flex items-center rounded-[4px] font-[500] text-sm"
              onClick={() => setMenuOpen(true)}
            >
              <>
                <UserIcon color="#262626" size={18} className="-mr-1" />
                <BsCheck2 color="#6d5d5d" width={18} height={18} />
              </>
            </button>
            {/* Unfollow option modal */}
            <OptionsModal isOpen={menuOpen} setIsOpen={setMenuOpen}>
              <div className="relative w-[90px] h-[90px] mx-4 my-8 bg-gray-100 rounded-full overflow-hidden ">
                <Image
                  src={user?.photoUrl ? user.photoUrl : "/icons/user.svg"}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
              <div className="w-full h-[50px] pb-4 flex items-center justify-center border-b border-gray-100">
                <span className="text-sm">Unfollow @{user?.username!}?</span>
              </div>
              <OptionButton
                title="Unfollow"
                onClick={handleUnfollowClick}
                textRed
                fontBold
              />
              <OptionButton title="Cancel" onClick={() => setMenuOpen(false)} />
            </OptionsModal>
            {/* Unfollow option modal */}
          </>
        )
      );
    default:
      return (
        currentUser && (
          <button
            className="bg-button-primary text-white px-6 text-sm h-[30px] rounded-[4px] font-[500] w-full sm:w-auto max-w-[250px]"
            onClick={handleFollowClick}
          >
            Follow
          </button>
        )
      );
  }
};

export default FollowButton;
