import React, { useState } from "react";
import Link from "next/link";
import InputField from "./InputField";
import { IUser } from "../../types";
import { useRouter } from "next/router";

import { auth } from "../../firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  AuthError,
} from "firebase/auth";

interface Props {
  user: IUser;
}

export const ChangePassword: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const buttonDisable =
    oldPassword.length === 0 ||
    newPassword.length === 0 ||
    confirmPassword.length === 0;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      window.alert("New password and confirm password does not match.");
    } else {
      if (oldPassword === newPassword) {
      }
      const credential = EmailAuthProvider.credential(
        auth.currentUser?.email!,
        oldPassword
      );

      reauthenticateWithCredential(auth.currentUser!, credential)
        .then(() => {
          updatePassword(auth.currentUser!, newPassword).then(() => {
            window.alert("Password has been changed successfully.");
          });
        })
        .catch((err: AuthError) => {
          console.log(err.code);

          if (err.code === "auth/wrong-password") {
            window.alert(
              "Wrong password. Please double check Old Password again."
            );
          } else if (err.code === "auth/too-many-requests") {
            window.alert(
              "You have requested too many password change. Please try again later."
            );
          }
        });
    }
  };
  return (
    user && (
      <form className="my-4 w-full h-fit flex flex-col" onSubmit={handleSubmit}>
        <InputField
          label="old password"
          value={oldPassword}
          setValue={setOldPassword}
          type="password"
        />
        <InputField
          label="new password"
          value={newPassword}
          setValue={setNewPassword}
          type="password"
        />
        <InputField
          label="confirm new password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          type="password"
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
          <Link href={"/accounts/edit/"}>
            <a
              className="text-sm font-semibold tracking-wide text-button-primary"
            >
              Edit Profile
            </a>
          </Link>
        </div>
      </form>
    )
  );
};

export default ChangePassword;
