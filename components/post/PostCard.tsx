import React, { useState } from "react";
import Image from "next/image";

// components
import { PostHeader } from ".";
import { LikeButton, SaveButton } from "../buttons";
import { CommentList, CommentForm } from "../comments";

// custom
import { CustomArrow, CustomDots, carouselResponsive } from "../custom";

// dependencies
import Carousel from "react-multi-carousel";
import moment from "moment";

// types
import { IPostWithUserData } from "../../types";

interface Props {
  post: IPostWithUserData;
}

export const PostCard: React.FC<Props> = ({ post }) => {
  const [captionClamped, setCaptionClamped] = useState(
    post.caption?.length! > 70
  );

  return (
    <div className="post mt-8 w-full last:mb-8">
      <PostHeader
        userPhotoUrl={post?.userPhotoUrl!}
        username={post.username}
        userId={post.userId}
        postId={post.id}
      />
      <Carousel
        swipeable
        responsive={carouselResponsive}
        keyBoardControl
        customTransition="all .3s ease-in-out"
        showDots={post.photos.length > 1 && true}
        renderDotsOutside
        removeArrowOnDeviceType={["mobile"]}
        containerClass="w-full bg-[#262626]"
        itemClass="relative w-full"
        dotListClass="!relative flex items-center justify-center"
        customLeftArrow={<CustomArrow theme="light" direction="left" />}
        customRightArrow={<CustomArrow theme="light" direction="right" />}
        customDot={<CustomDots outside={true} />}
      >
        {post.photos.map((photo) =>
          post.photos.length > 1 ? (
            <Image
              src={photo.url}
              priority
              layout="responsive"
              objectFit="contain"
              objectPosition="center"
              width={612}
              height={612}
              key={photo.name}
            />
          ) : (
            <img src={photo.url} className="w-full" key={photo.name}/>
          )
        )}
      </Carousel>
      <div
        className={`w-full ${
          post.photos.length > 1 ? "-mt-4" : "mt-2"
        } px-2 flex justify-between`}
      >
        <LikeButton postId={post.id} />
        <SaveButton postId={post.id} />
      </div>
      <div className="px-4">
        <div className="text-sm mb-2">
          <p
            className={`leading-2 ${
              captionClamped ? "line-clamp-1" : "line-clamp-none"
            } `}
          >
            <span className="font-[500] mr-2">{post.username}</span>
            {post.caption}
          </p>
          {captionClamped && (
            <button
              className="text-sm text-gray-400"
              onClick={() => setCaptionClamped(false)}
            >
              more
            </button>
          )}
        </div>
        <CommentList postId={post.id} type="card" />
        <p className="uppercase text-2xs text-gray-500 my-2 tracking-wide">
          {moment(post.createdAt).fromNow()}
        </p>
      </div>
      <CommentForm postId={post.id} />
    </div>
  );
};

export default PostCard;
