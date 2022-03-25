import React from "react";

import { useRouter } from "next/router";

export const EditProfileButton: React.FC = () => {
  const router = useRouter();
  return (
    <button
      className="text-sm h-[30px] font-[500] px-[9px] py-[5px] border border-gray-300 rounded-md active:text-gray-500 w-full max-w-[250px]"
      onClick={() => router.push("/accounts/edit")}
    >
      Edit Profile
    </button>
  );
};

export default EditProfileButton;
