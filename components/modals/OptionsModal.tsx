import React from "react";
import Modal from "react-modal";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const OptionsModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
      }}
      overlayClassName="modal-post__overlay"
      className={`modal-post bg-white w-[400px] rounded-xl animate-scaleDown overflow-hidden flex flex-col items-center justify-centers`}
    >
      {children}
    </Modal>
  );
};

export default OptionsModal;
