import { Button } from '@ncent-holdings/ux-components';
import React, { useEffect } from 'react';
import { Steps } from './types';
import Note from './Note';

interface ApiKeyNoteProps {
  invalidApiKeyNote?: string;
  handleApiKeyNoteValidation: (evt?: React.FormEvent<HTMLInputElement>) => void;
  handleApiKeyNote: (evt?: React.FormEvent<HTMLInputElement>) => void;
  handleCreateApiKey?: () => void;
  handleStepGeneration?: (value: Steps) => void;
}

const ApiKeyNote = ({
  invalidApiKeyNote = '',
  handleApiKeyNoteValidation,
  handleApiKeyNote,
  handleCreateApiKey,
  handleStepGeneration,
}: ApiKeyNoteProps) => {
  const handleCancel = () => {
    handleApiKeyNoteValidation();
    handleStepGeneration?.('INITIAL');
  };

  const handleContinue = () => {
    handleCreateApiKey?.();
  };

  useEffect(() => {
    handleApiKeyNote(undefined);
  }, []);

  return (
    <div>
      <Note
        handleApiKeyNoteValidation={handleApiKeyNoteValidation}
        handleOnBlur={handleApiKeyNote}
        invalidApiKeyNote={invalidApiKeyNote}
        label="Note (optional)"
      />
      <div className="mt-8 flex w-[400px] gap-4">
        <Button size="medium" className="w-full" onClick={handleCancel} variant="secondary" label="CANCEL" />
        <Button
          size="medium"
          className="w-full"
          onClick={handleContinue}
          variant="primary"
          label="CONTINUE"
          disabled={invalidApiKeyNote?.length > 0}
        />
      </div>
    </div>
  );
};

export default ApiKeyNote;
