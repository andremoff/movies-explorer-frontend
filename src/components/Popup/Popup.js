import React, { useEffect, useRef } from 'react';
import './Popup.css';

const Popup = ({ text, isOpen, onClose }) => {
  const popupRef = useRef(null);

  // Закрытие модального окно при нажатии на клавишу "Escape"
  useEffect(() => {
    const handleEscapeClose = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    // Закрытия модального окна на клавишу "Escape"
    document.addEventListener('keydown', handleEscapeClose);
    return () => {
      // Удаление обработчика при размонтировании компонента
      document.removeEventListener('keydown', handleEscapeClose);
    };
  }, [onClose]);

  // Закрытие модального окна при клике на оверлей
  const handleOverlayClick = (event) => {
    if (event.target === popupRef.current) {
      onClose();
    }
  };

  return (
    <section
      className={`popup ${isOpen ? 'popup_opened' : ''}`}
      onClick={handleOverlayClick}
      ref={popupRef}
    >
      <div className="popup__container" onClick={e => e.stopPropagation()}>
        <p className="popup__text">{text}</p>
        <button className="popup__close" type="button" onClick={onClose} />
      </div>
    </section>
  );
};

export default Popup;
