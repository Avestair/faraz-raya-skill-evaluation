import React, { useEffect } from "react";
import { PiX } from "react-icons/pi";
import { motion } from "motion/react";

interface ModalProps {
  mainContainerClassName?: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalHeaderProps {
  title: string;
  description?: string;
}

interface ModalBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface ModalFooterProps {
  className?: string;
  children: React.ReactNode;
}

export default function Modal({
  mainContainerClassName,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-100/30 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`relative m-4 grid w-full max-w-lg gap-4 rounded-lg bg-white p-6 shadow-xl dark:bg-stone-950 ${mainContainerClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 left-3 cursor-pointer text-2xl text-gray-500 transition-all duration-300 hover:text-gray-800 dark:text-gray-200"
          aria-label="Close modal"
        >
          <PiX className="size-6" />
        </button>

        {children}
      </div>
    </motion.div>
  );
}

Modal.Header = function ModalHeader({ title, description }: ModalHeaderProps) {
  return (
    <div className="grid gap-2 border-b pb-4">
      <p className="text-2xl font-bold text-gray-800 dark:text-stone-200">
        {title}
      </p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-stone-300">
          {description}
        </p>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ className, children }: ModalBodyProps) {
  return (
    <div className={`grid max-h-[70vh] gap-3 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <div
      className={`flex flex-col gap-3 border-t pt-4 md:flex-row ${className}`}
    >
      {children}
    </div>
  );
};
