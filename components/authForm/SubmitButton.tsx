import React from "react";

interface Props {
  title: string;
  disable: boolean;
}

export const SubmitButton: React.FC<Props> = ({
  title,
  disable,
}) => {
  return (
    <button
      className={`w-full my-2 ${
        disable ? "bg-button-disabled" : "bg-button-primary"
      } text-white px-2 py-[5px] rounded-md`}
      type="submit"
      disabled={disable}
    >
      {title}
    </button>
  );
};

export default SubmitButton;
