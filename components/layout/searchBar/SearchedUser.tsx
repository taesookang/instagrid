import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ISearchedUser } from "../../../types";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
  user: ISearchedUser;
  type: "current" | "recent";
  recentSearches: ISearchedUser[];
  setRecentSearches: React.Dispatch<React.SetStateAction<ISearchedUser[] | []>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchedUser: React.FC<Props> = ({
  user,
  type,
  recentSearches,
  setRecentSearches,
  setMenuOpen,
  setSearchTerm,
}) => {
  const router = useRouter();

  const addToRecentSearch = (user: ISearchedUser) => {
    setRecentSearches([user, ...recentSearches]);
  };

  const deleteFromRecentSearch = (user: ISearchedUser) => {
    setRecentSearches(
      recentSearches.filter((prevUser) => prevUser.username !== user.username)
    );
  };

  const handleOnClick = () => {
    if (type === "recent") {
      setMenuOpen(false);
      router.push(`/${user.username}`);
    } else {
      addToRecentSearch(user);
      router.push(`/${user.username}`).then(() => {
        setMenuOpen(false);
        setSearchTerm("");
      });
    }
  };
  return (
    <div
      className={`w-full h-[60px] px-4 py-2 flex ${
        type === "recent" ? "justify-between" : "justify-start"
      } hover:bg-gray-100 cursor-pointer`}
      key={user.username}
    >
      <div
        className="relative min-w-[44px] w-11 h-11 rounded-full overflow-hidden mr-3"
        onClick={handleOnClick}
      >
        <Image
          src={user.photoUrl}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div
        className="flex flex-col w-full justify-center text-sm leading-4"
        onClick={handleOnClick}
      >
        <span className="font-[500]">{user.username}</span>
        <p className="text-gray-400">{user.excerpt}</p>
      </div>
      {type === "recent" && (
        <button
          className="w-8 h-full ml-2 flex items-center justify-center text-gray-400"
          onClick={() => deleteFromRecentSearch(user)}
        >
          <IoCloseOutline size={28} />
        </button>
      )}
    </div>
  );
};

export default SearchedUser;
