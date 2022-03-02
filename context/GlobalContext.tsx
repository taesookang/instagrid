import React, { createContext, useContext, useState } from 'react'

interface GlobalContextInterface {
    createPostModalOpen: boolean
    setCreatePostModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalContext = createContext<GlobalContextInterface>({
    createPostModalOpen: false,
    setCreatePostModalOpen: () => false
});

export const GlobalContextProvider: React.FC = ({ children }) => {
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false)

    return (
        <GlobalContext.Provider value={{
            createPostModalOpen,
            setCreatePostModalOpen
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext =() => useContext(GlobalContext)