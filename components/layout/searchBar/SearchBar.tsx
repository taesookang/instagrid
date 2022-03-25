import React, { useState, useEffect, useRef } from "react";

import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { TailSpin } from "react-loader-spinner";

import { useOutsideClickListenerRef } from "../../../hooks/useOutsideClickListenerRef";
import SearchBarMenu from "./SearchBarMenu";

import { useDebounce } from "use-debounce";

import { ISearchedUser } from "../../../types";
import { getUsersBySearch } from "../../../firebase/service";

interface Props {}

export const SearchBar: React.FC<Props> = () => {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<ISearchedUser[] | []>([]);
  const [isLoading, setIsLoading] = useState(false)

  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputBoxRef = useOutsideClickListenerRef(() => {
    setInputIsFocused(false);
  });
  
  const [value] = useDebounce(searchTerm, 1000);
  const isTyping = value.length > 0;

  
  useEffect(() => {
    const searchUsers = async (value:string) => {
      setIsLoading(true)
      await getUsersBySearch(value).then((userList) => {
        setSearchedUsers(userList)
      })
      setIsLoading(false)
    };
    searchTerm.length > 0 && searchTerm === value ? searchUsers(value) : setSearchedUsers([])
  }, [value, searchTerm]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };
  return (
    <div
      className="relative w-64 h-9 bg-[#efefef] rounded-md hidden sm:flex items-center px-4 py-[2px] cursor-text z-20"
      ref={inputBoxRef}
    >
      <IoSearchOutline
        className={`text-[#8E8E8E] w-6 h-6 mr-2 ${inputIsFocused && "hidden"}`}
      />
      <input
        className={`w-full placeholder:font-[300] placeholder:text-[#8E8E8E] focus:border-none bg-transparent ${
          inputIsFocused ? "text-gray-800" : "text-gray-400"
        }`}
        type="text"
        placeholder="Search"
        onFocus={() => setInputIsFocused(true)}
        value={searchTerm}
        onChange={handleSearchTermChange}
        ref={inputRef}
      />
      <div
        onClick={() => {
          setSearchTerm("");
          setInputIsFocused(false);
        }}
      >
        {isLoading? 
          
         <TailSpin height={16} width={16} color="#a7a7a7" />
          :
          <IoCloseCircle
          className={`text-[#c7c7c7] w-6 h-6 ml-2 cursor-pointer ${
            !inputIsFocused && "hidden"
          }`}
        />}
      </div>
      {inputIsFocused && <SearchBarMenu searchedUsers={searchedUsers} isTyping={isTyping} setMenuOpen={setInputIsFocused} setSearchTerm={setSearchTerm} />}

    </div>
  );
};

export default SearchBar;
