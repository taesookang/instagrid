import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { TailSpin } from "react-loader-spinner";
import { useOutsideClickListenerRef } from "../../hooks/useOutsideClickListenerRef";
import { useRouter } from "next/router";

import { useAuth } from "../../context/AuthContext";
import { useGlobalContext } from "../../context/GlobalContext";

import { ModalCreatePost, ModalPost } from "../modals";


import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import HeaderMenu from "./HeaderMenu";

export const Header: React.FC = () => {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { createPostModalOpen, setCreatePostModalOpen } = useGlobalContext()

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputBoxRef = useOutsideClickListenerRef(() => {
    setInputIsFocused(false);
  });

  const userMenuRef = useOutsideClickListenerRef(() => {
    setMenuOpen(false)
  })

  const { currentUser } = useAuth();

  const logout = async () => {
    signOut(auth).then(() => {
      router.push("/accounts/login");
    });
  };
  

  return (
    currentUser &&
    <>
    {/* <ModalPost /> */}
      <ModalCreatePost isOpen={createPostModalOpen} setIsOpen={setCreatePostModalOpen}/>
      <div
        id="header"
        className="fixed w-full h-[60px] bg-white border-b border-gray-300 px-2 flex justify-center z-10"
      >
        <div className="container max-w-5xl h-full flex items-center justify-between">
          <Link href="/">
            <a className="relative w-36 h-10">
              <Image src="/logo.svg" layout="fill" />
            </a>
          </Link>

          <div
            className="w-64 h-9 bg-[#efefef] rounded-md flex items-center px-4 py-[2px] cursor-text"
            ref={inputBoxRef}
          >
            <IoSearchOutline
              className={`text-[#8E8E8E] w-6 h-6 mr-2 ${
                inputIsFocused && "hidden"
              }`}
            />
            <input
              className={`w-full placeholder:font-[300] placeholder:text-[#8E8E8E] focus:border-none bg-transparent ${
                inputIsFocused ? "text-gray-800" : "text-gray-400"
              }`}
              type="text"
              placeholder="Search"
              onFocus={() => setInputIsFocused(true)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={inputRef}
            />
            <div onClick={() => setSearchTerm("")}>
              <IoCloseCircle
                className={`text-[#c7c7c7] w-6 h-6 ml-2 cursor-default ${
                  !inputIsFocused && "hidden"
                }`}
              />
            </div>
            {/* <TailSpin height={16} width={16} color="#a7a7a7" /> */}
          </div>

          <div className="flex items-center justify-around w-36 !z-30">
            <Link href="/">
              <a className="relative w-6 h-6">
                <Image
                  src={`/icons/home_${
                    router.pathname === "/"
                      ? "fill"
                      : "outline"
                  }.svg`}
                  layout="fill"
                />
              </a>
            </Link>
            {/* <Link href={`${router.pathname}?create=select`} as="/create/select"> */}
              <button className="relative w-6 h-6"
                onClick={() => setCreatePostModalOpen((prev) => !prev)}
              >
                <Image
                  src={`/icons/add_${
                    createPostModalOpen ? "fill" : "outline"
                  }.svg`}
                  layout="fill"
                />
              </button>
            {/* </Link> */}
            <div className="relative">
              <div className={`w-7 h-7 flex items-center justify-center ${(router.query.username === currentUser.username || menuOpen )&& "border border-black rounded-full"}`}>
              <div className="relative w-6 h-6 rounded-full bg-gray-100 border border-gray-300 overflow-hidden cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
                ref={userMenuRef}
              >
                <Image
                  src={
                    currentUser?.photoUrl
                      ? currentUser.photoUrl
                      : "/icons/user.svg"
                  }
                  layout="fill"
                />
              </div>
              <HeaderMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} logout={logout} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
