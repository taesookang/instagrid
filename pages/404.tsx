import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GrInstagram } from 'react-icons/gr';
;




const ErrorPage = () => {
    const router = useRouter()
    useEffect(() => {
        router.push("/")
    }, []);
    
    
  return <div className='w-full h-screen flex items-center justify-center'><GrInstagram className='w-20 h-20 text-gray-200' /></div>;
};

export default ErrorPage;
