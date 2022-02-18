import React, { useState, useEffect } from "react";
import { auth, signInWithFacebook } from "../../firebase";
import { InputField, SubmitButton, Seperator } from ".";
import { AiFillFacebook } from "react-icons/ai";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import nookies from 'nookies';



const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, [auth]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
  };

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        console.log(err.message);
        setError(true);
      });
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
          <SubmitButton
            title="Log In"
            disable={email.length === 0 || password.length === 0}
          />
          <Seperator />
          {error && (
            <div className="text-sm text-red-500 text-center">
              Sorry, invalid credentials.
              <br /> Please check your email and password.
            </div>
          )}
          <div onClick={signInWithFacebook} className="flex items-center text-ocean font-[500] my-3 cursor-pointer">
            <AiFillFacebook className="mr-2 w-5 h-5" color="#375185" />
            <p>Log in with Facebook</p>
          </div>
          <p className="text-xs text-ocean cursor-pointer my-3">
            Forgot password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
