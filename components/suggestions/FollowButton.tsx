import React, { useState } from "react";
import { IUserEssentials } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { UnfollowUser, followUser } from "../../firebase/service";

interface Props {
  suggestedUser: IUserEssentials;
}

export const FollowButton: React.FC<Props> = ({ suggestedUser }) => {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.followings.includes({
      id: suggestedUser.id,
      username: suggestedUser.username,
    })
  );

  return (
    <button
      className={`${ isFollowing ? "text-basic-black":"text-button-primary"} text-xs font-semibold tracking-wide`}
      onClick={async () => {
        isFollowing
          ? await UnfollowUser(
              { id: suggestedUser.id, username: suggestedUser.username },
              { id: currentUser?.id!, username: currentUser?.username! }
            ).then(() => {
              setIsFollowing(false);
            })
          : await followUser(
              { id: suggestedUser.id, username: suggestedUser.username },
              { id: currentUser?.id!, username: currentUser?.username! }
            ).then(() => {
              setIsFollowing(true);
            });
      }}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
