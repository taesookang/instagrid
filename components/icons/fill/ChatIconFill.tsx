import React from "react";

interface Props {
  className?: string;
  color: string;
  width: number;
  height: number;
}

export const ChatIconFill: React.FC<Props> = ({
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
        <path
          d="M46.4568 25C46.4568 28.8775 45.8875 32.0526 44.1756 35.1858C44.064 35.3899 44.0217 35.6214 44.0788 35.8469C44.4867 37.4551 46.1831 42.8734 46.7861 45.629C46.9323 46.2973 46.3221 46.8035 45.6548 46.6528C42.9905 46.0511 37.8022 45.1249 35.9218 44.6239C35.6497 44.5514 35.3594 44.5788 35.1121 44.7135C30.9161 47 29.4774 47 24.7284 47C12.7281 47 3 37.1503 3 25C3 12.8497 12.7281 3 24.7284 3C36.7287 3 46.4568 12.8497 46.4568 25Z"
          fill={color}
        />
      </svg>
      
    </div>
  );
};

export default ChatIconFill;
