import React from 'react'

export const Seperator: React.FC = () => {
    return (
        <div className="relative h-[1.5px] w-full bg-gray-200 my-6">
            <span className="absolute my- top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-14 text-center text-gray-400 text-sm">
              OR
            </span>
          </div>
    );
}

export default Seperator;