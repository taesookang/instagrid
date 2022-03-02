import React from "react";

interface Props {
  title: string;
  onClick: () => void;
  fontBold?: boolean
  textRed?: boolean
}

export const OptionButton: React.FC<Props> = ({ title, onClick, fontBold=false, textRed=false }) => {
  return (
    <button
      onClick={onClick}
      className={`capitalize h-[48px] w-full flex items-center justify-center text-sm ${textRed && "text-[#ED4956]"} ${fontBold && "font-bold"} tracking-wide border-b border-gray-100`}
    >
      {title}
    </button>
  );
};

export default OptionButton;
