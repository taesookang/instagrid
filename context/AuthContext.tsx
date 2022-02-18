import { createContext, useContext, Context } from "react";

import React, { useEffect, useState } from "react";

import { auth, db } from "../firebase";
import { onIdTokenChanged } from "firebase/auth";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { IUser } from "../types";

import nookies from "nookies";
interface AuthContextInterface {
  currentUser: IUser | null;
}

const AuthContext = createContext<AuthContextInterface>({
  currentUser: null,
});

export const AuthContextProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // When auth changes, get & save an id token as a cookie and parse & set current user info.
  useEffect(() => {
    onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        nookies.set({}, "token", token, {
          path: "/",
        });
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        const userData = userDocSnap.data();

        const userObj: IUser = {
          id: userData?.id,
          email: userData?.email,
          username: userData?.username,
          excerpt: userData?.excerpt,
          photoUrl: userData?.photoUrl,
          followers: userData?.followers,
          followings: userData?.followings,
        };

        setCurrentUser(userObj);
      } else {
        setCurrentUser(null);
        // nookies.set({}, "token", "", { path: "/" });
        nookies.destroy({}, "token")
      }
    });
  }, [auth]);

  // Refresh token every 10 min
  useEffect(() => {
    const handleRefreshToken = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handleRefreshToken);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
