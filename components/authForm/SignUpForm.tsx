import React, { useState } from "react";
import { InputField, SubmitButton, Seperator } from ".";
import { AiFillFacebook } from "react-icons/ai";
import { useRouter } from "next/router";
import { auth, db, signInWithFacebook } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  setDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import { User } from "../../types";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if(user) {
      router.push("/")
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(email, password)
  };

  const signUp = async (email: string, password: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const usersSnapshot = await getDocs(q);

    if (usersSnapshot.docs.length > 0) {
      setError("Username is already in use.");
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredencial) => {
          const user = userCredencial.user;
          const modifiedUser: User = {
            email: user.email,
            excerpt: null,
            username: username,
            photoUrl: user.photoURL,
            followers: [],
            followings: [],
          };

          try {
            await setDoc(doc(db, "users", user.uid), modifiedUser);
          } catch (err) {
            console.error("Error adding document: ", err);
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
            setError("The email is already in use. Try with another one.");
          } else if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
            setError("Password should be at least 6 characters.");
          }
        });
    }
  };

  return (
    <div className="w-[350px]">
      <div className="border-box w-full min-h-[360px] bg-white flex flex-col items-center py-[10px]">
        <div className="my-3">
          <Image src={"/logo.svg"} width={175} height={60} />
        </div>
        <form
          className="flex flex-col items-center w-[80%]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-lg w-[268px] text-center leading-5 font-[500] text-gray-400 mb-4">
            Sign up to see photos and videos from your friends.
          </h1>
          <div onClick={signInWithFacebook} className="w-[278px] px-2 py-[5px] rounded-md flex items-center justify-center text-white bg-button-primary font-[500] cursor-pointer">
            <AiFillFacebook className="mr-2 w-5 h-5" color="#ffffff" />
            <p>Log in with Facebook</p>
          </div>
          <Seperator />

          <InputField
            title="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <InputField
            title="Password"
            type="password"
            value={password}
            setValue={setPassword}
          />
          <InputField
            title="Username"
            type="text"
            value={username}
            setValue={setUsername}
          />
          <SubmitButton
            title="Sign Up"
            disable={
              email.length === 0 ||
              password.length === 0 ||
              username.length === 0
            }
          />
          <div className="text-sm text-red-500 text-center">{error}</div>
          <p className="text-xs text-gray-500 my-3 text-center ">
            By signing up, you agree to our Terms , Data Policy and Cookies
            Policy .
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
