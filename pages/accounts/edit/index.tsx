import React from "react";
import Head from "next/head";
import { Layout } from '../../../components/layout'

const EditPage = () => {
  return (
    <div className="w-full h-full">
      <Head>
        <title>Edit Profile - Instagrid</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className="border-box max-w-[696px] h-80 mx-auto mt-[30px] bg-white ">
            
        </div>
     
    </div>
  );
};

EditPage.getLayout = function getLayout(page: React.ReactElement) {
    return <Layout>{page}</Layout>;
  };
export default EditPage;