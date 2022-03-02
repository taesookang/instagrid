import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

// firebase
import { db } from "../../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
// icons
import { HeartIconFill } from "../icons/fill";
import { HeartIconOutlined } from "../icons/outlined";

interface Props {
  postId: string;
}

export const LikeButton: React.FC<Props> = ({ postId }) => {
  const { currentUser } = useAuth();

  const postDoc = doc(db, "posts", postId);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);

  useEffect(() => {
    if(postId) {

      const unsubscribe = onSnapshot(postDoc, (doc) => {
        const data = doc.data();
        const fetchedLikes = data?.likes!
        fetchedLikes?.includes(currentUser?.id!)
          ? setIsLiked(true)
          : setIsLiked(false);
  
        setLikes(fetchedLikes);
      });
  
      return () => unsubscribe();
    }
  }, []);

  const handleLikeClick = async () => {
    if (isLiked) {
      await updateDoc(postDoc, {
        likes: arrayRemove(currentUser?.id!),
      });
    } else {
      await updateDoc(postDoc, {
        likes: arrayUnion(currentUser?.id!),
      });
    }
  };
  return (
    <>
      <div
        className="relative w-10 h-10 p-2 cursor-pointer"
        onClick={handleLikeClick}
      >
        {isLiked ? (
          <HeartIconFill
            className="animate-scaleUpToDown"
            color="#ED4956"
            width={24}
            height={24}
          />
        ) : (
          <HeartIconOutlined color="#262626" width={24} height={24} />
        )}
      </div>
      <div className="w-full flex items-center text-sm font-[500] mb-2 px-2">
        {likes?.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
          " " +
          (likes?.length > 1 ? "likes" : "like")}
      </div>
    </>
  );
};

export default LikeButton;
