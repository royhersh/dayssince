import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal(props) {
  const modalRoot = document.getElementById('modal');
  const el = document.createElement('div');

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  });

  return ReactDOM.createPortal(props.children, el);
}

export default Modal;
