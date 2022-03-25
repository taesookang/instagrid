import React from "react";

interface Props {
  className?: string;
  color: string;
  size: number;
}

export const GridTabIcon: React.FC<Props> = ({ className, color, size }) => {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48 4C48 2.89543 47.1046 2 46 2H4C2.89543 2 2 2.89543 2 4V46C2 47.1046 2.89543 48 4 48H46C47.1046 48 48 47.1046 48 46V4ZM16.375 4.875H4.875V16.375H16.375V4.875ZM19.25 16.375H30.75V4.875H19.25V16.375ZM45.125 16.375H33.625V4.875H45.125V16.375ZM19.25 19.25H30.75V30.75H19.25V19.25ZM33.625 30.75H45.125V19.25H33.625V30.75ZM33.625 45.125H45.125V33.625H33.625V45.125ZM30.75 45.125V33.625H19.25V45.125H30.75ZM16.375 33.625V45.125H4.875V33.625H16.375ZM16.375 19.25V30.75H4.875V19.25H16.375Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default GridTabIcon;
