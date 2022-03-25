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
import BookMarkFill from '../icons/fill/BookMarkFill';
import BookMarkOutlined from '../icons/outlined/BookMarkOutlined';

interface Props {
  postId: string;
}

export const SaveButton: React.FC<Props> = ({ postId }) => {
  const { currentUser } = useAuth();
  const postDoc = doc(db, "posts", postId);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if(postId) {
      const unsubscribe = onSnapshot(postDoc, (doc) => {
        const data = doc.data();
        const savedBy = data?.savedBy!
        savedBy?.includes(currentUser?.id!)
          ? setIsSaved(true)
          : setIsSaved(false);
      });
  
      return () => unsubscribe();
    }
  }, []);

  const handleSaveClick = async () => {
    if (isSaved) {
      await updateDoc(postDoc, {
        savedBy: arrayRemove(currentUser?.id!),
      });
    } else {
      await updateDoc(postDoc, {
        savedBy: arrayUnion(currentUser?.id!),
      });
    }
  };
  return (
    <div className="flex flex-col">
      <div
        className="relative w-10 h-10 p-2 cursor-pointer"
        onClick={handleSaveClick}
      >
        {isSaved ? (
          <BookMarkFill
            color="#262626"
            size={24}
          />
        ) : (
          <BookMarkOutlined className="hover:opacity-50" color="#262626" size={24} />
        )}
      </div>
    </div>
  );
};

export default SaveButton;