import React from "react";
import { ArrowProps } from "react-multi-carousel/lib/types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CustomArrowProps extends ArrowProps {
  direction: "right" | "left";
}

const CustomArrows: React.FC<CustomArrowProps> = ({ direction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute ${
        direction === "right" ? "right-2" : "left-2"
      } flex items-center justify-center bg-black/50 text-white w-8 h-8 rounded-full `}
    >
      {direction === "right" ? (
        <FiChevronRight className="w-5 h-5" />
      ) : (
        <FiChevronLeft className="w-5 h-5" />
      )}
    </button>
  );
};

export default CustomArrows;
