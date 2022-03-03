import React, { useEffect }  from 'react'

interface Props {
    label: string
    value: string,
    initialValue?: string | null
    setValue: React.Dispatch<React.SetStateAction<string>>
    type: string
}

export const InputField: React.FC<Props> = ({ label, value, setValue, initialValue, type }) => {
    useEffect(() => {
        if(initialValue) {
            setValue(initialValue)
        }
    },[])
    
    return (
        <div className='flex mt-4 flex-col sm:flex-row'>
        <aside className="px-5 sm:px-8 min-w-[194px] h-8 flex justify-start sm:justify-end items-center">
            <label htmlFor={label} className='capitalize font-[500] tracking-wide text-right leading-5'>
              {label}
            </label>
          </aside>
          <div className="px-5 sm:px-0 sm:pr-[60px] w-full flex">
            <div className="flex basis-auto sm:basis-[355px] w-[355px]">
              <input
                className="w-full h-8 px-[10px] border border-gray-200 rounded-sm bg-white"
                name={label}
                type={type}
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
            </div>
          </div>
        </div>

    );
}

export default InputField;