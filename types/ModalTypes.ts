export type ModalProps = {
  mainContainerClassName?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export type ModalHeaderProps = {
  title: string;
  description?: string;
};

export type ModalBodyProps = {
  className?: string;
  children: React.ReactNode;
};

export type ModalFooterProps = {
  className?: string;
  children: React.ReactNode;
};
