import React from "react";
import { IUser } from "../../types";

interface Props {
  user: IUser;
  postsLength: number;
}

export const ProfileDashboard: React.FC<Props> = ({ user, postsLength }) => {
  return (
    <div className="grid grid-cols-3 items-center text-sm tracking-normal py-3 border-y border-gray-200 sm:flex sm:text-[16px] sm:h-6 sm:mb-5 sm:py-0 sm:border-none">
      <p className="flex flex-col w-full items-center text-gray-500 sm:text-basic-black sm:mr-10 sm:block sm:w-auto">
        <span className="font-[500] text-basic-black">{postsLength}</span>{" "}
        posts
      </p>
      <p className="flex flex-col w-full items-center text-gray-500 sm:text-basic-black sm:mr-10 sm:block sm:w-auto">
        <span className="font-[500] text-basic-black">{user.followers.length}</span> followers
      </p>
      <p className="flex flex-col w-full items-center text-gray-500 sm:text-basic-black sm:mr-10 sm:block sm:w-auto">
        <span className="font-[500] text-basic-black">{user.followings.length}</span> following
      </p>
    </div>
  );
};

export default ProfileDashboard;
