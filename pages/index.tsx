import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/accounts/login");
    } else {
      setUser(user);
    }
  });

  console.log(user);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>{user?.uid}</div>
      <button
        onClick={() => signOut(auth).then(() => router.push("/accounts/login"))}
      >
        sign out
      </button>
    </div>
  );
}
