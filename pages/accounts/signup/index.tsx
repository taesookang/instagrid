import React from "react";
import Head from "next/head";
import { SignUpForm, SwitchBox } from "../../../components/authForm";

const SignUpPage = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>SignUp - Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SignUpForm />
      <SwitchBox
        title="log in"
        message="Have an account?"
        pushUrl="/accounts/login"
      />
    </div>
  );
};

export default SignUpPage;
