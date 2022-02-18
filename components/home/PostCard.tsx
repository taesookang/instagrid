import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CustomArrow, CustomDots, carouselResponsive } from "../custom";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

// dependencies
import Carousel from "react-multi-carousel";
import moment from "moment";

// firebase
import { db } from "../../firebase";
import {
  updateDoc,
  setDoc,
  doc,
  arrayUnion,
  onSnapshot,
  query,
  where,
  collection,
  orderBy,
} from "firebase/firestore";

// icons
import { HiOutlineDotsHorizontal } from "react-icons/hi";

// types
import { IPost, IComment } from "../../types";

interface Props {
  post: IPost;
}

export const PostCard: React.FC<Props> = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<IComment[] | []>([]);
  const { currentUser } = useAuth();

  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const commentFormRef = useRef<HTMLFormElement | null>(null);


  const isValidToSubmitComment = newComment.replace(/\s/g, '').length > 0
  // real time comments update effect
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", post.id),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const comment: IComment = {
          id: data.id,
          postId: data.postId,
          userId: data.userId,
          username: data.username,
          userPhotoUrl: data.userPhotoUrl,
          value: data.value,
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
      postId: post.id,
      userId: currentUser!.id,
      username: currentUser!.username,
      userPhotoUrl: currentUser!.photoUrl,
      value: newComment,
      createdAt: Date.now(),
    };
    const postDoc = doc(db, "posts", post.id);
    const commentDoc = doc(db, "comments", newCommentObj.id);

    setDoc(commentDoc, newCommentObj).then(() => {
      updateDoc(postDoc, {
        comments: arrayUnion(newCommentObj.id),
      });
      setNewComment("");
    });
  };

  return (
    <div className="post mt-8 w-full">
      <div className="h-[60px] border-b border-[#bdbdbd] flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-300 mr-2">
            <Image
              src={post.userPhotoUrl ? post.userPhotoUrl : "/icons/user.svg"}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <span className="text-sm font-[500]">{post.username}</span>
        </div>
        <div>
          <HiOutlineDotsHorizontal width={24} height={24} />
        </div>
      </div>
      <Carousel
        swipeable
        responsive={carouselResponsive}
        keyBoardControl
        customTransition="all .3s ease-in-out"
        showDots
        renderDotsOutside
        removeArrowOnDeviceType={["mobile"]}
        containerClass="carousel-container w-full"
        itemClass="relative w-full"
        dotListClass="!relative flex items-center justify-center"
        customLeftArrow={<CustomArrow theme="light" direction="left" />}
        customRightArrow={<CustomArrow theme="light" direction="right" />}
        customDot={<CustomDots outside={true} />}
      >
        {post.photos.map((photoUrl) => (
          <Image
            src={photoUrl}
            layout="responsive"
            objectFit="cover"
            objectPosition="center"
            width={612}
            height={612}
            key={photoUrl}
          />
        ))}
      </Carousel>
      <div className="w-full -mt-4 ml-2">
        <div className="relative w-10 h-10 p-2 cursor-pointer">
          <Image src="/icons/heart_fill.svg" width={24} height={24} />
        </div>
      </div>
      <div className="px-4">
        <div className="w-full flex items-center text-sm font-[500] mb-2">
          {post.likes.length} likes
        </div>
        <div className="flex text-sm">
          <p className="leading-2 line-clamp-2">
            <span className="font-[500] mr-2">{post.username}</span>
            {post.caption}
          </p>
        </div>
        <button className="text-sm text-gray-500">more</button>
        {comments.map((comment) => (
          <p className="text-sm">
            <span className="font-[500] hover:underline cursor-pointer">{comment.username}</span> {comment.value}
          </p>
        ))}
        <p className="uppercase text-2xs text-gray-500 my-2 tracking-wide">
          {moment(post.createdAt).fromNow()}
        </p>
      </div>
      <form
        className="w-full min-h-[54px] border-t border-gray-200 px-4 py-2 flex items-center"
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
          onKeyDown={(e) =>{
            if(e.key === "Enter" && !e.shiftKey && isValidToSubmitComment) {
              e.preventDefault()
              commentFormRef.current?.requestSubmit()
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
    </div>
  );
};

export default PostCard;
