import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ISearchedUser } from "../../../types";
import SearchedUser from "./SearchedUser";

interface Props {
  searchedUsers: ISearchedUser[];
  isTyping: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchBarMenu: React.FC<Props> = ({
  searchedUsers,
  isTyping,
  setMenuOpen,
  setSearchTerm,
}) => {
  const { currentUser } = useAuth();
  const initialList = sessionStorage.getItem(`rs:${currentUser?.username!}`)
    ? JSON.parse(sessionStorage.getItem(`rs:${currentUser?.username!}`)!)
    : [];

  const [recentSearches, setRecentSearches] = useState<ISearchedUser[] | []>(
    initialList
  );

  useEffect(() => {
    sessionStorage.setItem(
      `rs:${currentUser?.username!}`,
      JSON.stringify(recentSearches)
    );
  }, [recentSearches]);

  return (
    <div className="absolute flex flex-col pt-3 top-12 -left-[60px] w-[375px] h-[450px] bg-white z-20 drop-shadow-menu rounded-md">
      <div className="triangle absolute z-30 -top-[10px] left-[186px]" />
      {searchedUsers.length > 0 ? (
        searchedUsers.map((user) => (
          <SearchedUser
            user={user}
            type="current"
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
            key={user.username}
            setMenuOpen={setMenuOpen}
            setSearchTerm={setSearchTerm}
          />
        ))
      ) : isTyping ? (
        <div className="flex w-full h-full items-center justify-center text-sm text-gray-400">
          No results found.
        </div>
      ) : (
        <>
          <div className="mx-4 mt-1 flex justify-between ">
            <h4 className="font-[500]">Recent</h4>
            <button
              className="text-button-primary text-sm font-[500]"
              onClick={() => setRecentSearches([])}
            >
              Clear All
            </button>
          </div>
          <div className="w-full h-full my-2 overflow-scroll">
            {recentSearches.length > 0 ? (
              recentSearches.map((user) => (
                <SearchedUser
                  user={user}
                  type="recent"
                  recentSearches={recentSearches}
                  setRecentSearches={setRecentSearches}
                  setMenuOpen={setMenuOpen}
                  setSearchTerm={setSearchTerm}
                  key={user.username}
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 font-[500]">
                No recent searches.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBarMenu;
