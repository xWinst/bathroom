import { createPortal } from 'react-dom';
import { Icon } from 'components';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ close, st = {}, children }) => {
  return createPortal(
    <div className={s.overlay}>
      <div className={s.modal}>
        <Icon cn={s.icon} icon="close" w="15" click={close} />
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
