import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { IComment } from "../../types";
import Comment from "./Comment";
import { deleteComment } from "../../firebase/service";
import { OptionsModal, OptionButton } from "../modals";

interface Props {
  postId: string;
}

export const CommentList: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[] | []>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<IComment["id"] | null>(
    null
  );

  const router = useRouter();

  // real time comments update effect
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach(async (document) => {
        const data = document.data();
        const userDoc = doc(db, "users", data.userId);
        const userSnapshot = await getDoc(userDoc);
        const userPhotoUrl = userSnapshot.data()?.photoUrl;

        const comment: IComment = {
          id: data.id,
          postId: data.postId,
          userId: data.userId,
          username: data.username,
          value: data.value,
          userPhotoUrl: userPhotoUrl,
          createdAt: data.createdAt,
        };

        setComments((prev) => {
          const prevComments = prev.filter((x) => x.id !== comment.id);
          return [...prevComments, comment];
        });
      });
    });

    return () => unsubscribe();
  }, []);

  const deleteClickHandle = async () => {
    await deleteComment(selectedComment!, postId).then(async () => {
      setComments((prev) => prev.filter((x) => x.id !== selectedComment));
      setModalOpen(false);
    });
  };

  return (
    <>
      {/* Delete comment option modal */}
      <OptionsModal isOpen={modalOpen} setIsOpen={setModalOpen}>
        <OptionButton
          title={"Delete"}
          onClick={deleteClickHandle}
          fontBold
          textRed
        />
        <OptionButton title={"Cancel"} onClick={() => setModalOpen(false)} />
      </OptionsModal>
      {/* */}
      {comments.map((comment: IComment) => (
        <Comment
          key={comment.id}
          comment={comment}
          setModalOpen={setModalOpen}
          setSelectedComment={setSelectedComment}
        />
      ))}
    </>
  );
};
export default CommentList;
