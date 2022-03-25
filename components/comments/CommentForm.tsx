import React,{ useState, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { IComment } from "../../types";

// firebase
import { db } from "../../firebase";
import {
  updateDoc,
  setDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

interface Props {
    postId: string
}

export const CommentForm: React.FC<Props> = ({postId}) => {


    const [newComment, setNewComment] = useState("");
  const { currentUser } = useAuth();

    const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const commentFormRef = useRef<HTMLFormElement | null>(null);

  const isValidToSubmitComment = newComment.replace(/\s/g, "").length > 0;

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault;
        setNewComment(e.target.value);
        // comment input box height expands/shrinks responding to number of text lines
        commentInputRef.current!.style.height = "0px";
        commentInputRef.current!.style.maxHeight = "80px";
        commentInputRef.current!.style.height = commentInputRef.current!.scrollHeight + "px";
      };
    
      const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newCommentObj: IComment = {
          id: uuidv4(),
          postId: postId,
          userId: currentUser!.id,
          username: currentUser!.username,
          userPhotoUrl: currentUser!.photoUrl,
          value: newComment,
          createdAt: Date.now(),
        };
        const postDoc = doc(db, "posts", postId);
        const commentDoc = doc(db, "comments", newCommentObj.id);
    
        setDoc(commentDoc, newCommentObj).then(() => {
          updateDoc(postDoc, {
            comments: arrayUnion(newCommentObj.id),
          });
          setNewComment("");
        });
      };
    return (
    <>
    <form
        className="w-full h-fit min-h-[54px] border-t border-gray-200 px-4 py-2 flex items-center"
        onSubmit={handleCommentSubmit}
        ref={commentFormRef}
      >
        <div className="w-10 h-10 py-2 pr-4">
          <Image src="/icons/smile.svg" width={24} height={24} />
        </div>
        <textarea
          className="h-[18px] w-full text-sm pr-2"
          placeholder="Add a comment..."
          autoComplete="off"
          autoCorrect="off"
          value={newComment}
          ref={commentInputRef}
          onChange={handleCommentChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && isValidToSubmitComment) {
              e.preventDefault();
              commentFormRef.current?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="text-button-primary text-sm font-[500] disabled:text-blue-200"
          disabled={!isValidToSubmitComment}
        >
          Post
        </button>
      </form>
    </>
    );
}

export default CommentForm;