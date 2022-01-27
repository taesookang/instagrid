import React, { useState, useRef } from "react";

interface Props {
  title: string;
  type: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const InputField: React.FC<Props> = ({
  title,
  type,
  value,
  setValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative mb-2 w-full">
      <input
        autoComplete="on"
        type={showPassword ? "text" : type}
        className={`w-full h-[38px] border-box rounded-sm px-[8px] tracking-wide ${
          value.length > 0 && "text-xs pt-4"
        }`}
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
      />
      {value.length > 0 && title === "Password" && (
        <span
          className="absolute select-none transform -translate-y-1/2 top-[50%] right-0 h-full px-2 flex items-center cursor-pointer text-sm"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      )}
      <span
        className={`absolute select-none transform -translate-y-1/2 left-0 text-gray-400 px-2 ${
          value.length > 0 ? "text-xs top-3" : "text-sm top-[50%]"
        } transition-all duration-200 cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        {title}
      </span>
    </div>
  );
};

export default InputField;
