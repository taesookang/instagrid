import React from 'react'
import { useRouter } from 'next/router';
;


interface Props {
    title: string
    message: string
    pushUrl: string
}

export const SwitchBox: React.FC<Props> = ({title, message, pushUrl }) => {
    const router = useRouter()
    return (
        <div className="w-[350px] mt-2">
        <div className="border-box bg-white w-full flex items-center justify-center h-20">
          <div className="flex w-full items-center justify-center text-sm">
            <p className="text-gray-600 mr-2">{message}</p>
            <span
              onClick={() => {
                router.push(pushUrl);
              }}
              className="capitalize text-button-primary cursor-pointer"
            >
              {title}
            </span>
          </div>
        </div>
      </div>
    );
}

export default SwitchBox;