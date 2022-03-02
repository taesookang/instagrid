import React from "react";

interface Props {
  className?: string;
  color: string;
  width: number;
  height: number;
  fill?: boolean;
}

export const HeartIconFill: React.FC<Props> = ({
  className,
  color,
  width,
  height,
}) => {
  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* <rect width="50" height="50" fill="white" /> */}
        <path
          d="M42.5858 25.5858L42.5677 25.6039L42.55 25.6225L33.05 35.6225L25 44.0962L7.45743 25.6303C5.09337 23.0848 4 19.5296 4 16C4 10.4772 8.47715 6 14 6C15.8659 6 17.9607 6.93912 19.8545 8.21142C21.7189 9.46399 23.095 10.8393 23.4654 11.2825L25 13.1188L26.5346 11.2825C26.905 10.8393 28.2811 9.46399 30.1455 8.21142C32.0393 6.93912 34.1341 6 36 6C41.5229 6 46 10.4772 46 16C46 19.6086 45.0754 23.0961 42.5858 25.5858Z"
          stroke={color}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};

export default HeartIconFill;
