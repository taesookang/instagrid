import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from 'next/router'
import { useAuth } from "../../../context/AuthContext";
import { Layout } from "../../../components/layout";
import { InputField } from '../../../components/authForm'
import EditForm from "../../../components/edit/EditForm";
import ChangePassword from "../../../components/edit/ChangePassword";
import { IUser } from "../../../types";

const EditPage = () => {
  const { currentUser } = useAuth();

  const router = useRouter()
  return (
    <div className="w-full h-full">
      <Head>
        <title>Edit Profile - Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="border-box max-w-[696px] min-h-[300px] h-fit mx-auto mt-[30px] bg-white ">
        { currentUser && <div className="h-[42px] mt-8 w-full flex items-center">
          <button className="relative w-[38px] h-[38px] ml-5 sm:ml-[124px] mr-[32px] rounded-full overflow-hidden border border-gray-300">
            <Image
              src={
                currentUser?.photoUrl ? currentUser.photoUrl : "/icons/user.svg"
              }
              layout={"fill"}
            />
          </button>
          <div className=" flex flex-col justify-center">
            <h1 className="text-xl tracking-normal">{currentUser?.username}</h1>
            <button className="text-sm text-button-primary font-semibold tracking-wide">
              Change Profile Photo
            </button>
          </div>
        </div>}
        {
          router.query.password ? <ChangePassword user={currentUser as IUser} />:
          <EditForm user={currentUser as IUser} />
        }
        
      </div>
    </div>
  );
};

EditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditPage;
