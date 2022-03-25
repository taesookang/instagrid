import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// hooks & context
import { useOutsideClickListenerRef } from "../../hooks/useOutsideClickListenerRef";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useGlobalContext } from "../../context/GlobalContext";

// firebase
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot  } from 'firebase/firestore'

// components
import { ModalCreatePost } from "../modals";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./searchBar/SearchBar";


export const Header: React.FC = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  const { createPostModalOpen, setCreatePostModalOpen } = useGlobalContext()
  const router = useRouter();


  const userMenuRef = useOutsideClickListenerRef(() => {
    setMenuOpen(false)
  })

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const userDoc = doc(db, "users", currentUser.id);
      const unsubscribe = onSnapshot(userDoc, (doc) => {
        const userData = doc.data();
        setUserPhotoUrl(userData?.photoUrl);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

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

          <SearchBar />

          <div className="flex items-center justify-around w-36 !z-30">
            <Link href="/">
              <a className="relative w-6 h-6">
                <Image
                  src={`/icons/home_${
                    router.pathname === "/" && !router.query["explore"] && !createPostModalOpen
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
                    userPhotoUrl
                      ? userPhotoUrl
                      : "/icons/user.svg"
                  }
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
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
