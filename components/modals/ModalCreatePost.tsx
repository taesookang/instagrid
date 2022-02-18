// General
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { IPost } from "../../types";
import { CustomArrow, CustomDots, carouselResponsive } from "../custom";
// Icons
import { IoClose } from "react-icons/io5";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { BsCheckCircleFill } from "react-icons/bs";
// Dependencies
import Carousel from "react-multi-carousel";
import Modal from "react-modal";
import Dropzone from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
// Firebase
import { storage, db, auth } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";

// Auth
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement("#__next");

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}



export const ModalCreatePost: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadIsDone, setUploadIsDone] = useState(false);
  const [openCaptionInput, setOpenCaptionInput] = useState(false);
  const [caption, setCaption] = useState("");

  const { currentUser } = useAuth();

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setCaption(e.target.value);
  };

  const uploadPost = async () => {
    setOpenCaptionInput(false);
    const newPost: IPost = {
      id: uuidv4(),
      userId: currentUser?.id!,
      userPhotoUrl: currentUser?.photoUrl!,
      username: currentUser?.username!,
      photos: [],
      likes: [],
      comments: [],
      createdAt: Date.now(),
      caption: caption,
    };

    const postDoc = doc(db, "posts", newPost.id);
    selectedFiles.map((file) => {
      const imageId = uuidv4();
      const storageRef = ref(storage, `images/${imageId}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              newPost.photos.push(url);
            })
            .then(async () => {
              await setDoc(postDoc, newPost);
            });
        })
        .catch((err) => console.log(err));
    });

    setSelectedFiles([]);
    setUploadIsDone(true);
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false)
        setSelectedFiles([]);
        setUploadIsDone(false);
        setOpenCaptionInput(false);
        setCaption("");
      }}
      contentLabel="Create Post"
      className={`absolute bg-white ${
        openCaptionInput
          ? "w-[348px] sm:w-[90%] max-w-[910px] sm:min-w-[570px] min-w-[348px]"
          : "w-1/2 max-w-[570px] min-w-[348px]"
      }  max-h-[613px] animate-scaleDown rounded-xl overflow-hidden transtion-all duration-300 ease-in-out`}
      overlayClassName="modal-create__overlay"
    >
      <IoClose
        onClick={() => setIsOpen(false)}
        className="fixed top-4 right-4 text-white w-10 h-10 cursor-pointer"
      />
      <div className="h-11 w-full flex items-center justify-between border-b border-gray-200 font-[500]">
        <div
          className={`w-14 h-full flex items-center justify-center text-center cursor-pointer ${
            selectedFiles.length ? "visable" : "invisible"
          }`}
          onClick={
            openCaptionInput
              ? () => setOpenCaptionInput(false)
              : () => setSelectedFiles([])
          }
        >
          <HiOutlineArrowLeft className="w-7 h-7" />
        </div>
        <div>Create new post</div>
        <div
          className={`w-14 h-full flex items-center justify-center text-center text-button-primary text-sm cursor-pointer ${
            selectedFiles.length ? "visable" : "invisible"
          }`}
          onClick={
            !openCaptionInput ? () => setOpenCaptionInput(true) : uploadPost
          }
        >
          {!openCaptionInput ? "Next" : "Share"}
        </div>
      </div>
      <div className="flex w-full">
        <div
          className={`${
            openCaptionInput ? "w-1/2 lg:w-2/3 hidden sm:flex" : "w-full"
          } max-w-[570px] h-full flex items-center justify-center aspect-square `}
        >
          {uploadIsDone ? (
            <div className="flex flex-col items-center justify-center ">
              <div>
                <BsCheckCircleFill className="w-24 h-24 text-green-400 animate-scaleUp my-4" />
              </div>
              <div className="text-gray-600 text-xl text-center">
                Uploaded new post successfully
              </div>
            </div>
          ) : selectedFiles.length ? (
            <Carousel
              swipeable={true}
              showDots={selectedFiles.length > 1}
              responsive={carouselResponsive}
              keyBoardControl={true}
              customTransition="all .01"
              containerClass="carousel-container w-full"
              removeArrowOnDeviceType={["mobile"]}
              itemClass="relative w-full h-full"
              customLeftArrow={<CustomArrow theme="dark" direction="left" />}
              customRightArrow={<CustomArrow theme="dark" direction="right" />}
              customDot={<CustomDots />}
            >
              {selectedFiles.map((file, index) => (
                <Image
                  src={URL.createObjectURL(file)}
                  layout="responsive"
                  objectFit="cover"
                  objectPosition="center"
                  width={570}
                  height={570}
                  key={index}
                />
              ))}
            </Carousel>
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                setSelectedFiles([...acceptedFiles]);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="flex items-center justify-center flex-col">
                    <Image src="/icons/image.svg" width={50} height={50} />
                    <p className="text-lg font-xl my-4">
                      Drag photos and drop here
                    </p>
                    <button className="px-3 py-1 bg-button-primary text-white rounded-md">
                      Select from computer
                    </button>
                  </div>
                </div>
              )}
            </Dropzone>
          )}
        </div>
        {openCaptionInput && (
          <div className="w-[348px] sm:w-1/2 lg:w-full min-h-full aspect-square lg:aspect-auto">
            <div className="flex flex-col w-full h-full justify-between">
              <div className="flex flex-col w-full">
                <div className="h-[60px] px-4 flex items-center">
                  <div className="relative min-w-[28px] w-7 h-7 rounded-full bg-gray-100 border border-gray-300 mr-3">
                    <Image src="/icons/user.svg" layout="fill" />
                  </div>
                  <span className="font-[500]">{currentUser?.username}</span>
                </div>
                <textarea
                  value={caption}
                  rows={10}
                  cols={100}
                  onChange={handleCaptionChange}
                  placeholder="Write a caption..."
                  className="w-full px-4"
                  maxLength={400}
                />
              </div>

              <div className="w-full flex items-center justify-end my-4 px-4">
                <div className="text-sm text-gray-300">
                  {caption.length + "/400"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalCreatePost;
