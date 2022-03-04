import React from "react";

interface Props {
  className?: string;
  color: string;
  width: number;
  height: number;
  fill?: boolean;
}

export const UserIcon: React.FC<Props> = ({
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
        <circle cx="25" cy="18" r="9" fill={color} />
        <path
          d="M11 41.0769C11 34.9593 15.9593 30 22.0769 30H27.9231C34.0407 30 39 34.9593 39 41.0769V41.0769C39 41.5867 38.5867 42 38.0769 42H11.9231C11.4133 42 11 41.5867 11 41.0769V41.0769Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default UserIcon;
