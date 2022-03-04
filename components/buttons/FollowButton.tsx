import React, { useState } from "react";
import Image from "next/image";
import { UserIcon } from "../icons/fill";
import { BsCheck2 } from "react-icons/bs";
import { OptionsModal, OptionButton } from "../modals";
import { IUser } from "../../types";

import { useAuth } from "../../context/AuthContext";
import { followUser, UnfollowUser } from "../../firebase/service";

interface Props {

  user: IUser;
}

export const FollowButton: React.FC<Props> = ({ user }) => {
  
  const { currentUser } = useAuth();
  const followings = currentUser?.followings! as string[]
  const [isFollowing, setIsFollowing] = useState(followings?.includes(user.id))
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFollowClick = async () => {
    await followUser(user.id, currentUser?.id!).then(() => {
      setIsFollowing(true)
      setMenuOpen(false)
    })
  };

  const handleUnfollowClick = async () => {
    await UnfollowUser(user.id, currentUser?.id!).then(() => {
      setIsFollowing(false)
    })
  }

  switch (isFollowing) {
    case true:
      return (
        currentUser && 
        <>
          <button
            className="h-[30px] px-6 flex justify-center items-center text-white rounded-[4px] font-[500] text-sm border border-gray-300"
            onClick={() => setMenuOpen(true)}
          >
            <UserIcon
              color="#262626"
              width={18}
              height={18}
              className={"-mr-1"}
            />
            <BsCheck2 color="#6d5d5d" width={18} height={18} />
          </button>
          {/* Unfollow option modal */}
          <OptionsModal isOpen={menuOpen} setIsOpen={setMenuOpen}>
            <div className="relative w-[90px] h-[90px] mx-4 my-8 bg-gray-100 rounded-full overflow-hidden ">
              <Image
                src={user?.photoUrl ? user.photoUrl : "/icons/user.svg"}
                layout="fill"
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
      );
    default:
      return (
        currentUser &&
        <button className="h-[30px] px-6 bg-button-primary text-white rounded-[4px] font-[500] text-sm"
          onClick={handleFollowClick}
        >
          Follow
        </button>
      );
  }
};

export default FollowButton;
