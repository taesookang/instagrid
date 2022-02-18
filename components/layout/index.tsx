import React from "react";
import Header from "./Header";
import { ModalCreatePost, ModalPost } from "../modals";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <ModalPost />
      <Header />
      <div className="w-screen min-h-screen bg-[#fafafa] pt-[60px]">{children}</div>
    </>
  );
};
