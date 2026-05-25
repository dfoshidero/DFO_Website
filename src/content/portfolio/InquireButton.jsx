import React, { useContext } from 'react';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { ModalContext } from '../../utils/modalContext';
import InquireForm from './InquireForm';
import '../../components/seemore-button/SeeMore.scss';

function InquireButton({ initialImageId, text = 'INQUIRE', className = '' }) {
  const { openModal } = useContext(ModalContext);

  const handleClick = () => {
    openModal(
      <InquireForm initialImageId={initialImageId} />,
      { title: 'Inquire about a painting' }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`see-more-button ${className}`.trim()}
    >
      {text} <PaletteOutlinedIcon fontSize="inherit" className="button-icon" />
    </button>
  );
}

export default InquireButton;
