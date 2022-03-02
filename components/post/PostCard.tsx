import React, { useState } from "react";
import Image from "next/image";
import { PostHeader, LikeButton } from ".";
import { CommentList, CommentForm } from '../comments'

import { CustomArrow, CustomDots, carouselResponsive } from "../custom";

// dependencies
import Carousel from "react-multi-carousel";
import moment from "moment";

// types
import { IPostWithUserPhoto } from "../../types";

interface Props {
  post: IPostWithUserPhoto;
}

export const PostCard: React.FC<Props> = ({ post }) => {
  console.log(post);
  
  return (
    <div className="post mt-8 w-full">
      <PostHeader
        userPhotoUrl={post?.userPhotoUrl!}
        username={post.username}
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
            priority
            layout="responsive"
            objectFit="cover"
            objectPosition="center"
            width={612}
            height={612}
            key={photoUrl}
          />
        ))}
      </Carousel>
      <div
        className={`w-full ${post.photos.length > 1 ? "-mt-4" : "mt-2"} ml-2`}
      >
        <LikeButton postId={post.id} />
      </div>
      <div className="px-4">
        <div className="flex text-sm">
          <p className="leading-2 line-clamp-2">
            <span className="font-[500] mr-2">{post.username}</span>
            {post.caption}
          </p>
        </div>
        <button className="text-sm text-gray-500">more</button>
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
