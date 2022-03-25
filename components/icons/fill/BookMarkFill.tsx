import React from "react";

interface Props {
  className?: string;
  color: string;
  size: number
  fill?: boolean;
}

export const BookMarkFill: React.FC<Props> = ({
  className,
  color,
  size
}) => {
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
          d="M5 4H45V46.0473L26.777 32.6502C25.7198 31.8729 24.2802 31.8729 23.223 32.6502L5 46.0473L5 4Z"
          fill={color}
          stroke={color}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};

export default BookMarkFill;
