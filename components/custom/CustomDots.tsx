import React from "react";
import { DotProps } from "react-multi-carousel/lib/types";

interface CustomeDotProps extends DotProps  {
  outside?: boolean 
}


const CustomDots: React.FC<CustomeDotProps> = ({ outside=false ,active, onClick }) => {
  return (
    <button
      className={`${active ? "bg-button-primary" : "bg-gray-400"} ${outside?"mt-4":"mb-6"} w-[6px] h-[6px] mx-[2px] rounded-full`}
      onClick={onClick}
    >
    </button>
  );
};

export default CustomDots;