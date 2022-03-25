import React, { useState, useEffect } from "react";
import { HeartIconFill, ChatIconFill } from "../../components/icons/fill";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { getPostDataFromDoc } from "../../firebase/service";

interface Props {
  postId: string;
}

export const ThumbnailOverlay: React.FC<Props> = ({ postId }) => {
  const [LikesLength, setLikesLength] = useState(0);
  const [CommentsLength, setCommentsLength] = useState(0);
    
  useEffect(() => {
    const postDoc = doc(db, "posts", postId);

    const unsubscribe = onSnapshot(postDoc, async (doc) => {
      const fetchedPost = await getPostDataFromDoc(doc);
        
      setLikesLength(fetchedPost.likes.length);
      setCommentsLength(fetchedPost.comments.length);
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="absolute w-full h-full bg-black/20 flex items-center justify-center z-10 hover:opacity-100 opacity-0 ">
      <div className="flex text-white font-bold mr-[30px]">
        <HeartIconFill size={19} color="white" className="mt-[2px] mr-[7px]" />
        {LikesLength}
      </div>
      <div className="flex text-white font-bold">
        <ChatIconFill size={19} color="white" className="mt-[2px] mr-[7px]" />
        {CommentsLength}
      </div>
    </div>
  );
};

export default ThumbnailOverlay;
