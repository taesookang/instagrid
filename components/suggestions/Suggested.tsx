import React from "react";
import { IUserEssentials } from "../../types";
import SuggestedUser from "./SuggestedUser";

interface Props {
  suggestions: IUserEssentials[];
}

export const Suggested: React.FC<Props> = ({ suggestions }) => {
  return (
    <div className="min-h-section h-full flex justify-center bg-white sm:bg-none">
      <div className="max-w-[600px] w-full py-0 sm:py-[60px]">
        <span className="font-[500] mt-4 mb-3 px-3 block">Suggested</span>
        <div className="w-full bg-white py-2">
            {suggestions.map((suggestion) => (
                <div className="px-4 py-2">
                <SuggestedUser suggestedUser={suggestion} />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Suggested;
