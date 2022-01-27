import React from "react";
import Head from "next/head";
import { LoginForm, SwitchBox } from "../../../components/authForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Login - Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginForm />

      <SwitchBox
        title={"sign up"}
        message="Don't have an account?"
        pushUrl="/accounts/signup"
      />
    </div>
  );
};

export default LoginPage;
