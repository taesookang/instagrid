import React from "react";
import Header from "./Header";
import { ModalCreatePost } from "../modals/createPost";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <ModalCreatePost />
      <Header />
      <div className="w-screen h-full bg-[#fafafa]">{children}</div>
    </>
  );
};
