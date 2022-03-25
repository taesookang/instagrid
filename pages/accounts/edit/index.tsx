import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { Layout } from "../../../components/layout";
import { InputField } from "../../../components/authForm";
import EditForm from "../../../components/edit/EditForm";
import ChangePassword from "../../../components/edit/ChangePassword";
import { IUser } from "../../../types";
import { updatePhotoUrl } from "../../../firebase/service";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { TailSpin } from "react-loader-spinner";

const EditPage = () => {
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      const userDoc = doc(db, "users", currentUser.id);
      const unsubscribe = onSnapshot(userDoc, (doc) => {
        const userData = doc.data();
        setUserPhotoUrl(userData?.photoUrl);
        setIsUploading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const selectedFile = e.currentTarget.files && e.currentTarget.files[0];

    if (currentUser && selectedFile) {
      setIsUploading(true);
      await updatePhotoUrl(selectedFile).catch((err:Error) => {
        console.log(err.message);
      });
    }
  };

  
  return (
    <div className="w-full h-full">
      <Head>
        <title>Edit Profile - Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="border-box max-w-[696px] min-h-[300px] h-fit mx-auto mt-[30px] bg-white ">
        {currentUser && (
          <div className="h-[42px] mt-8 w-full flex items-center">
            <button className="relative w-[38px] h-[38px] ml-5 sm:ml-[124px] mr-[32px] rounded-full overflow-hidden border border-gray-300">
              <Image
                src={
                  // currentUser?.photoUrl ? currentUser.photoUrl : "/icons/user.svg"
                  userPhotoUrl ? userPhotoUrl : "/icons/user.svg"
                }
                layout={"fill"}
                objectFit="cover"
                objectPosition="center"
              />
              {isUploading && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
                  <TailSpin width={14} height={14} color="#a7a7a7" />
                </div>
              )}
            </button>
            <div className=" flex flex-col justify-center">
              <h1 className="text-xl tracking-normal">
                {currentUser?.username}
              </h1>
              <button
                className="text-sm text-button-primary font-semibold tracking-wide"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
                Change Profile Photo
              </button>
            </div>
          </div>
        )}
        {router.query.password ? (
          <ChangePassword user={currentUser as IUser} />
        ) : (
          <EditForm user={currentUser as IUser} />
        )}
      </div>
    </div>
  );
};

EditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditPage;
