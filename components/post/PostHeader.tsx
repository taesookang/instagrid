import React, { useState } from 'react'
import Image from 'next/image'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { OptionButton, OptionsModal } from '../modals';
import { deletePost } from '../../firebase/service'

interface Props {
    userPhotoUrl: string
    username: string
    postId: string
}

export const PostHeader: React.FC<Props> = ({ userPhotoUrl=null, username, postId}) => {
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false)

  const deletePostHandle = async () => {
    await deletePost(postId).then(() => {
      setDeletePostModalOpen(false)
    })
  }
    return (
        <div className="h-[60px] min-h-[60px] border-b border-gray-200 flex items-center justify-between px-4 order-first">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-300 mr-2">
              <Image
                src={`${userPhotoUrl ? userPhotoUrl:"/icons/user.svg"}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <span className="text-sm font-[500]">{username}</span>
          </div>
          {/* Delete post option modal */}
          <OptionsModal isOpen={deletePostModalOpen} setIsOpen={setDeletePostModalOpen} >
            <OptionButton title="Delete" onClick={deletePostHandle} textRed fontBold/>
            <OptionButton title="Cancel" onClick={() => setDeletePostModalOpen(false)}  />
          </OptionsModal>
          {/* */}
          <button onClick={() => setDeletePostModalOpen(true)}>
            <HiOutlineDotsHorizontal width={24} height={24} />
          </button>
        </div>
    );
}

export default PostHeader;