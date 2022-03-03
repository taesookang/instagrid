import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import InputField from "./InputField";
import { IUser } from "../../types";

import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { updateProfile, updateEmail } from "firebase/auth";

interface Props {
  user: IUser;
}

export const EditForm: React.FC<Props> = ({ user }) => {
  const [excerpt, setExcerpt] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const buttonDisable = !(
    (excerpt !== null && excerpt !== user?.excerpt!) ||
    (username !== null && username !== user?.username!) ||
    (email !== null && email !== user?.email!)
  );

  const router = useRouter();

  const handleEditSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const usersRef = collection(db, "users");
    const qUsername = query(
      usersRef,
      where("username", "==", username.toLowerCase())
    );
    const qEmail = query(usersRef, where("email", "==", email));
    const usersSnapshotWihtUsername = await getDocs(qUsername);
    const usersSnapshotWithEmail = await getDocs(qEmail);

    if (usersSnapshotWihtUsername.docs.length > 0 && usersSnapshotWihtUsername.docs[0].data().username !== user.username ) {
      window.alert("Username is already in use.");
    } else if (usersSnapshotWithEmail.docs.length > 0 && usersSnapshotWithEmail.docs[0].data().email !== user.email) {
      window.alert("Email is already in use.");
    } else {
      username !== user?.username! &&
        updateProfile(auth?.currentUser!, {
          displayName: username,
        });
      email !== user?.email! && updateEmail(auth?.currentUser!, email);
      updateDoc(doc(db, "users", user.id), {
          excerpt: excerpt,
          username: username,
          email: email
      })
      window.alert("Profile has been updated successfully.")
    }
  };

  return (
    user && (
      <form
        className="my-4 w-full h-fit flex flex-col"
        onSubmit={handleEditSubmit}
      >
        <InputField
          label="name"
          initialValue={user.excerpt!}
          value={excerpt}
          setValue={setExcerpt}
          type="text"
        />
        <InputField
          label="username"
          initialValue={user.username!}
          value={username}
          setValue={setUsername}
          type="text"
        />
        <InputField
          label="email"
          initialValue={user.email!}
          value={email}
          setValue={setEmail}
          type="email"
        />
        <div className="w-full flex my-12 pl-[20px] pr-[20px] sm:pr-32 sm:pl-[194px] justify-between items-center">
          <button
            disabled={buttonDisable}
            type="submit"
            className={`text-sm px-[9px] py-[5px] text-white ${
              buttonDisable ? "bg-button-disabled" : "bg-button-primary"
            } rounded-[4px]`}
          >
            Submit
          </button>
          <Link
            href={{
              pathname: router.asPath,
              query: { password: "change" },
            }}
            as={"/accounts/password/change"}
          >
            <a className="text-sm font-semibold tracking-wide text-button-primary">
              Change Password
            </a>
          </Link>
        </div>
      </form>
    )
  );
};

export default EditForm;
