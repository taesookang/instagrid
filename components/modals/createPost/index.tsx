import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Modal from "react-modal";
import Dropzone from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { HiOutlineArrowLeft, HiOutlineEmojiHappy } from "react-icons/hi";
import { BsCheckCircleFill } from "react-icons/bs";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { storage, db, auth } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Post } from "../../../types";
import CustomArrows from './custom/customArrows';
import CustomDots from "./custom/customDots";



const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

Modal.setAppElement("#__next");
interface Props {}

export const ModalCreatePost: React.FC<Props> = () => {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadIsDone, setUploadIsDone] = useState(false);
  const [openCaptionInput, setOpenCaptionInput] = useState(false);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    console.log(caption.length);
  }, [caption]);

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setCaption(e.target.value);
  };

  const uploadPost = async () => {
    setOpenCaptionInput(false);
    const newPost: Post = {
      id: uuidv4(),
      userId: auth.currentUser?.uid,
      photos: [],
      likes: [],
      comments: [],
      createAt: Date.now(),
      caption: caption,
    };

    const postDoc = doc(db, "posts", newPost.id);
    await setDoc(postDoc, newPost)
      .then(() => {
        selectedFiles.map((file) => {
          const imageId = uuidv4();
          const storageRef = ref(storage, `images/${imageId}`);
          uploadBytes(storageRef, file)
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                updateDoc(postDoc, {
                  photos: arrayUnion(url),
                });
              });
            })
            .catch((err) => console.log(err));
        });
      })
      .then(() => {
        setSelectedFiles([]);
        setUploadIsDone(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      isOpen={!!router.query.create}
      onAfterClose={() => {
        setSelectedFiles([]);
        setUploadIsDone(false);
        setOpenCaptionInput(false);
      }}
      onRequestClose={() => router.push("/")}
      contentLabel="Create Post"
      className={`absolute bg-white ${
        openCaptionInput
          ? "w-[348px] sm:w-[90%] max-w-[910px] sm:min-w-[570px] min-w-[348px]"
          : "w-1/2 max-w-[570px] min-w-[348px]"
      }  max-h-[613px] animate-scaleDown rounded-xl overflow-hidden transtion-all duration-300 ease-in-out`}
      overlayClassName="modal-create__overlay"
    >
      <IoClose
        onClick={() => router.back()}
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
              showDots={true}
              responsive={responsive}
              keyBoardControl={true}
              customTransition="all .01"
              containerClass="carousel-container w-full"
              removeArrowOnDeviceType={["mobile"]}
              dotListClass=""
              itemClass="relative w-full h-full"
              customLeftArrow={<CustomArrows direction="left" />}
              customRightArrow={<CustomArrows direction="right" />}
              customDot={<CustomDots />}
            >
              {selectedFiles.map((file) => (
                <Image
                  src={URL.createObjectURL(file)}
                  layout="responsive"
                  objectFit="cover"
                  objectPosition="center"
                  width={570}
                  height={570}
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
                  <span className="font-[500]">taes00kang</span>
                </div>
                <textarea
                  value={caption}
                  rows={10}
                  cols={100}
                  onChange={handleCaptionChange}
                  placeholder="Write a caption..."
                  className="w-full px-4 focus:outline-none resize-none placeholder:text-gray-500"
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

