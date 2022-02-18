import React from "react";
import { ArrowProps } from "react-multi-carousel/lib/types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CustomArrowProps extends ArrowProps {
  direction: "right" | "left"
  theme: "light" | "dark"
}

const CustomArrow: React.FC<CustomArrowProps> = ({ theme, direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute ${
        direction === "right" ? "right-2" : "left-2"
      } ${theme === "light" ? "bg-white/50 text-black" : "bg-black/50 text-white" } flex items-center justify-center  w-8 h-8 rounded-full shadow-md `}
    >
      {direction === "right" ? (
        <FiChevronRight className="w-5 h-5" />
      ) : (
        <FiChevronLeft className="w-5 h-5" />
      )}
    </button>
  );
};

export default CustomArrow;
