import React from 'react';
import { CopyClipboardProps } from './types';
import CopyIcon from './copyIcon.svg?react';
import useClipboardApi from '@src/hooks/useClipboardApi';
import { TOOLTIP_ID_CONTEXT, useTooltipContext } from '@src/contexts/TooltipContext/TooltipContext';

const CopyClipboard = ({ text, tooltipHideDelay = 500 }: CopyClipboardProps) => {
  const { copy } = useClipboardApi();
  const { setTooltip } = useTooltipContext();

  const handleCopyToClipboard = async () => {
    try {
      await copy(text || '');
      setTooltip({
        isOpen: true,
        render: ({ content }) => <p className="font-medium">{content}</p>,
        place: 'top',
        positionStrategy: 'fixed',
      });
    } catch (err) {
      console.error('clipboard copy error:', err);
    }
  };

  return (
    <div
      data-tooltip-id={TOOLTIP_ID_CONTEXT}
      data-tooltip-content="Copied!"
      className="cursor-pointer"
      onClick={handleCopyToClipboard}
      onMouseLeave={() => setTooltip({ isOpen: false })}
      data-tooltip-delay-hide={tooltipHideDelay}
    >
      <CopyIcon />
    </div>
  );
};

export default CopyClipboard;
