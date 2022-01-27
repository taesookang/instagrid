import React, { useState, useRef } from "react";
import Head from "next/head";

import { useRouter } from "next/router";
import { LoginForm } from "../../../components/authForm";

const LoginPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Login - Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginForm />

      <div className="w-[350px] mt-2">
        <div className="border-box bg-white w-full flex items-center justify-center h-20">
          <div className="flex w-full items-center justify-center text-sm">
            <p className="text-gray-600 mr-2">Don't have an account?</p>
            <span
              onClick={() => {
                router.push("/accounts/signup");
              }}
              className="text-button-primary cursor-pointer"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
