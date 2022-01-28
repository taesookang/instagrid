import { ReactElement, useEffect } from "react";
import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "../components/layout";
import { auth, db } from "../firebase";
import { User } from "../types";
import { onAuthStateChanged, signOut } from "firebase/auth";

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button
        onClick={() => signOut(auth).then(() => router.push("/accounts/login"))}
      >
        sign out
      </button>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
