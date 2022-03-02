import React from "react";
import { useGlobalContext } from '../../context/GlobalContext'

export const NoPosts: React.FC = () => {
  const { setCreatePostModalOpen } = useGlobalContext()

  return (
    <div className="w-full h-full flex items-center justify-center flex-col text-lg gap-2 text-gray-400">
      <p>No posts to view yet.</p>
      <p>Start with uploading a post.</p>
      <button className="w-48 py-1 bg-button-primary text-white mt-3 text-base rounded-md"
        onClick={() => setCreatePostModalOpen(true)}
      >
        Upload Post
      </button>
    </div>
  );
};

export default NoPosts;
