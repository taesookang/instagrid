import React from "react";
import { DotProps } from "react-multi-carousel/lib/types";


const CustomDots = ({ active, onClick }:DotProps) => {
  return (
    <button
      className={`${active ? "bg-button-primary" : "bg-gray-400"} w-[6px] h-[6px] mx-[2px] rounded-full mb-6`}
      onClick={onClick}
    >
    </button>
  );
};

export default CustomDots;