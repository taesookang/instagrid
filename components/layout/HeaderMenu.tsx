import React, { Dispatch } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '../../context/AuthContext';


interface Props {
  setMenuOpen: Dispatch<boolean>
  menuOpen: boolean;
  logout: () => void
}


export const HeaderMenu: React.FC<Props> = ({ menuOpen, setMenuOpen, logout }) => {

    const { currentUser } = useAuth()


    const menu = [
        {
          title: "Profile",
          link: `/${currentUser?.username}`,
          icon: "/icons/profile.svg",
        },
        {
          title: "Setting",
          link: "/accounts/edit",
          icon: "/icons/setting.svg",
        },
      ];
  return (
    <div
      className={`absolute top-[40px] -right-[38px] w-[230px] h-max bg-white z-20 drop-shadow-menu flex-col ${
        menuOpen ? "flex" : "hidden"
      }`}
    >
      <div className="triangle absolute z-10 -top-[10px] right-10" />

      <div className="w-full flex flex-col mb-1">
      {menu.map((m) => (
        <Link href={m.link} key={m.title}>
          <a className="w-full h-[37px] flex items-center px-4 py-2 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            <div className="mr-2 h-full flex items-center">
              <Image src={m.icon} width={16} height={16} />
            </div>
            <span className="text-sm">{m.title}</span>
          </a>
        </Link>
      ))}
        </div>
      <div className="w-full h-[37px] flex items-center px-4 py-2 hover:bg-gray-50 border-t border-gray-200 cursor-pointer"
        onClick={logout}
      >
        <span className="text-sm">Log Out</span>
      </div>
      <div></div>
    </div>
  );
};

export default HeaderMenu;
