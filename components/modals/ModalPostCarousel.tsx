import React from 'react'
import Image from "next/image";


import { CustomArrow, CustomDots, carouselResponsive } from "../custom";
import Carousel from "react-multi-carousel";
import { IPhoto } from '../../types';

interface Props {
    photos: IPhoto[]
}

export const ModalPostCarousel: React.FC<Props> = ({ photos }) => {
    return (
        <Carousel
        swipeable
        responsive={carouselResponsive}
        keyBoardControl
        customTransition="all .3s ease-in-out"
        showDots={photos.length > 1 && true}
        removeArrowOnDeviceType={["mobile"]}
        containerClass="h-full w-full flex items-center bg-black"
        itemClass="relative w-full aspect-square"
        dotListClass="!mb-4"
        customLeftArrow={<CustomArrow theme="light" direction="left" />}
        customRightArrow={<CustomArrow theme="light" direction="right" />}
        customDot={<CustomDots outside={true} />}
      >
        {photos.map((photo) => (
          <Image
            src={photo.url}
            priority
            layout="fill"
            objectPosition="center"
            key={photo.name}
          />
        ))}
      </Carousel>
    );
}

export default ModalPostCarousel;