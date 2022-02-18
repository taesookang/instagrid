import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useOutsideClickLisnterRef } from "../../hooks/useOutsideClickLisnterRef";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { IPost } from "../../types/index";
interface Props {}

export const ModalPost: React.FC<Props> = () => {
  const [post, setPost] = useState<IPost | null>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    !!router.query.pid ? setIsOpen(true) : setIsOpen(false);
  }, [router.query.pid]);
  const { pid } = router.query;

  const postId = pid as string;

  useEffect(() => {
    const getPost = async () => {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      const data = postDoc.data()
      
      setPost({
        id: data?.id,
        userId: data?.userId,
        userPhotoUrl: data?.userPhotoUrl,
        username: data?.username,
        photos: data?.photos,
        likes: data?.likes,
        comments: data?.comments,
        createdAt: data?.createdAt,
        caption: data?.caption,
      });
    };
    isOpen && getPost();
  },[isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false), setPost(null), router.back();
        router.replace(`${router.query.username}`, undefined, {
          shallow: true,
        });
      }}
      overlayClassName="modal-post__overlay"
      className={`modal-post w-full aspect-[5/3] max-h-full max-w-[1240px] rounded-xl animate-scaleDown overflow-hidden transtion-all duration-300 ease-in-out`}
    >
      <IoClose
        onClick={() => {
          setIsOpen(false), router.back();
        }}
        className="fixed top-4 right-4 text-white w-10 h-10 cursor-pointer"
      />
      <div className="h-full w-full lg:w-auto lg:aspect-square flex items-center bg-black justify-center">
        <div className="relative w-full max-h-full aspect-square">
          <Image src={"/images/img1.png"} layout="fill" />
        </div>
      </div>
      <div className="min-w-[404px] w-full h-full bg-white">
        <div className="h-[60px] border-b border-[#bdbdbd] flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-300 mr-2">
              <Image
                src={`${post?.userPhotoUrl ? post.userPhotoUrl:"/icons/user.svg"}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <span className="text-sm font-[500]">{post?.username}</span>
          </div>
          <div>
            <HiOutlineDotsHorizontal width={24} height={24} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPost;
