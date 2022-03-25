import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IUser } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { OptionButton, OptionsModal } from "../../components/modals";
import { FollowButton } from "../../components/buttons";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { getPostsByUserId, getPostsLengthById } from "../../firebase/service";
import { useMediaQuery } from "react-responsive";

import { EditProfileButton, ProfileDashboard } from ".";

interface Props {
  user: IUser;
  isOwner: boolean;
}

export const ProfileInfo: React.FC<Props> = ({ user, isOwner }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [postsLength, setPostsLength] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  useEffect(() => {
    const getPostsLength = async () => {
      await getPostsLengthById(user.id).then((length) => {
        setTimeout(() => {
          setPostsLength(length);
          setIsLoading(false);
        }, 200);
      });
    };

    user && getPostsLength();
  }, [user]);


  const logout = async () => {
    signOut(auth).then(() => {
      router.push("/accounts/login");
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-full px-4 flex sm:min-h-[150px] sm:mb-11 sm:px-0">
        <div className="sm:w-1/3 sm:mr-0 mr-7 h-full flex items-center sm:justify-center ">
          <div className="relative min-w-[77px] sm:min-w-[150px] h-[77px] sm:h-[150px] border border-gray-300 rounded-full bg-gray-100 overflow-hidden">
            <Image
              src={user.photoUrl ? user.photoUrl : "/icons/user.svg"}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority
            />
          </div>
        </div>
        <div className="w-2/3 h-full flex flex-col">
          <div className="h-[77px] sm:h-10 flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-start mb-5">
            <div className="flex items-center">
              <span className=" text-[28px] font-[300] tracking-normal sm:mr-5">
                {user.username}
              </span>
              {currentUser && isOwner ? (
                <>
                  {!isMobile && <EditProfileButton />}
                  <button
                    className="ml-[5px] min-w-[40px] w-10 h-10 p-2"
                    onClick={() => setOptionModalOpen(true)}
                  >
                    <Image src="/icons/setting.svg" width={24} height={24} />
                  </button>
                  <OptionsModal
                    isOpen={optionModalOpen}
                    setIsOpen={setOptionModalOpen}
                  >
                    <OptionButton
                      title={"Change Password"}
                      onClick={() =>
                        router.replace(
                          {
                            pathname: "/accounts/edit/",
                            query: { password: "change" },
                          },
                          "/accounts/password/change"
                        )
                      }
                    />
                    <OptionButton title={"Log Out"} onClick={logout} />
                    <OptionButton
                      title={"Cancel"}
                      onClick={() => setOptionModalOpen(false)}
                    />
                  </OptionsModal>
                </>
              ) : (
                currentUser &&
                !isMobile && <FollowButton user={user} type="profile" />
              )}
            </div>
            {isMobile &&
              (isOwner ? (
                <EditProfileButton />
              ) : (
                <FollowButton user={user} type="profile" />
              ))}
          </div>

          {!isMobile && !isLoading && (
            <ProfileDashboard postsLength={postsLength} user={user} />
          )}

          {!isMobile&& user.excerpt && (
            <div className="w-full">
              <span className="text-[16px] font-[500] tracking-normal">
                {user.excerpt}
              </span>
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <div className="w-full px-4 mb-4 ">
          <span className="text-sm font-[500] tracking-normal">
            {user.excerpt}
          </span>
        </div>
      )}
      {isMobile && !isLoading && (
        <ProfileDashboard postsLength={postsLength} user={user} />
      )}
    </div>
  );
};

export default ProfileInfo;
