import React, { useContext } from 'react';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { ModalContext } from '../../utils/modalContext';
import InquireForm from './InquireForm';
import { useUiText } from '../../utils/contentContext';
import '../../components/seemore-button/SeeMore.scss';

function InquireButton({ initialImageId, text, className = '' }) {
  const { openModal } = useContext(ModalContext);
  const { cardExtras, inquiryForm } = useUiText();
  const label = text ?? cardExtras.inquireButtonLabel;

  const handleClick = () => {
    openModal(
      <InquireForm initialImageId={initialImageId} />,
      { title: inquiryForm.modalTitle }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`see-more-button ${className}`.trim()}
    >
      {label} <PaletteOutlinedIcon fontSize="inherit" className="button-icon" />
    </button>
  );
}

export default InquireButton;
