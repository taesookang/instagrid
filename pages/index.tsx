import { ReactElement, useEffect } from "react";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";
import { auth, db } from "../firebase";
import { User } from "../types";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export default function Home() {
  
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/accounts/login");
      } else {
        console.log(user.uid);
      }
    });
  }, [auth]);

  return (
    <>
    
    <div className="min-h-screen pt-[60px] flex justify-center items-start">
      <Head>
        <title>Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex h-full min-w-[935px] gap-7">
        <div className="flex flex-col min-w-[614px]">
          <div className="post mt-8">
            <div className=" h-[60px] border-b border-[#bdbdbd] flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-300 mr-2">
                  <Image
                    src="/images/img3.png"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <span className="text-sm font-[500]">taesoo</span>
              </div>
              <div>
                <HiOutlineDotsHorizontal width={24} height={24} />
              </div>
            </div>
            <div className="relative w-full">
              <Image
                src="/images/img1.png"
                layout="responsive"
                width={614}
                height={614}
              />
            </div>
            <div>
              <div className="w-full h-14 px-4 py-2">
                <div className="relative w-10 h-10 p-2">
                  <Image
                    src="/icons/heart_fill.svg"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div className="flex flex-col min-w-[293px] sticky top-[60px] self-start pt-8">
          <div className="flex my-4 items-center">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-300 mr-4">
              <Image
                src="/images/img4.png"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="flex flex-col h-[30px] justify-center text-sm">
              <span className="text-gray-600 font-semibold">taesoo</span>
              <p className="text-gray-400 ">React/Next Developer</p>
            </div>
          </div>

          <div className="mt-2 w-full flex items-center justify-between">
            <p className="capitalize text-gray-400 font-semibold tracking-wide text-sm">
              Suggestions for you
            </p>
            <span className="capitalize text-xs font-[500] cursor-pointer">
              see all
            </span>
          </div>

          <div className="flex flex-col py-2">
            <div className="flex items-center justify-between w-full h-12 py-2 px-4">
              <div className="relative min-w-[32px] w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image
                  src="/images/img2.png"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
              <div className="flex flex-col h-full w-full justify-between">
                <span className="text-sm leading-none">manura</span>
                <p className="text-sm leading-none text-gray-400">Followed by taesoo</p>
              </div>
              <span className=" text-button-primary text-xs font-semibold tracking-wide">Follow</span>
            </div>
          </div>
        </div>
      </section>

      {/* <button
        onClick={() => signOut(auth).then(() => router.push("/accounts/login"))}
      >
        sign out
      </button> */}
    </div>
    </>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
