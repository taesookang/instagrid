import React from "react";
import Link from "next/link";

export const NoPosts: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col text-lg gap-2 text-gray-400">
      <p>No posts to view yet.</p>
      <p>Start with uploading a post.</p>
      <Link href="/?create=select" as="/create/select">
        <button className="w-48 py-1 bg-button-primary text-white mt-3 text-base rounded-md">
          Upload Post
        </button>
      </Link>
    </div>
  );
};

export default NoPosts;
