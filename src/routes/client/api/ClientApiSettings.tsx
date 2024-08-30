import React, { useEffect, useMemo, useState } from 'react';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { Button, Field, Heading, Modal, OvalLoader } from '@ncent-holdings/ux-components';
import { ColumnDef, Table } from '@components/Table';
import { getColumns } from './apiKeyColDefs';
import { Link } from 'react-router-dom';
import useSession from '@src/api-hooks/session/useSession';
import { useGetApiKeysQuery } from '@src/api-hooks/api-keys/apiKeysApi';
import { ApiKeyRequest } from '@src/api/CloudAPI/models';
import { cloudAPI } from '@src/apiSingleton';
import { ApiKey, Steps } from './types';
import { match } from 'ts-pattern';
import CopyClipboard from '@src/components/CopyClipboard';
import ApiKeyNote from './ApiKeyNote';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

export const MAX_NOTE_LENGTH = 90;
const LEARN_MORE_URL = 'https://support.delos.com/hc/en-us';
const PLAN_ID = 'CUBE_API_1001';

export const ClientApiSettings = () => {
  const [stepGeneration, setStepGeneration] = useState<Steps>('INITIAL');
  const [invalidApiKeyNote, setInvalidApiKeyNote] = useState('');
  const [selectedApiKey, setSelectedApiKey] = useState<string | undefined>('');
  const [apiKeyNote, setApiKeyNote] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState<string | undefined>();
  const [apiKeyData, setApiKeyData] = useState<ApiKey[] | []>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();
  const [, sessionAPI] = useSession();
  const { id: userId } = sessionAPI.getAuthorizedUserData();

  const { orgId: selectedOrgId } = useOrganizationFromHandle();
  const apiParams = apiKeyValue
    ? { api_key: apiKeyValue }
    : {
        org_id: selectedOrgId,
        site_id: selectedSiteId,
        user_id: userId,
        ...(apiKeyNote && { note: apiKeyNote }),
      };

  const { data: initialApiKeysData, isLoading } = useGetApiKeysQuery(apiParams, {
    skip: !selectedOrgId || !selectedSiteId || !userId,
  });

  const handleCloseModal = () => setShowDeleteModal(false);
  const handleOpenModal = (evt: React.MouseEvent<Element, MouseEvent>, data: ApiKey) => {
    setSelectedApiKey(data.apiKey);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if (!initialApiKeysData?.api_key_details) return;

    const data = initialApiKeysData.api_key_details.map((detail: any) => {
      return {
        apiKey: detail.api_key,
        dateCreated: detail.created_at,
        note: detail.note,
        monthlyCalls: detail.usage,
      };
    });

    setApiKeyData((prevData) => {
      const existingKeys = new Set(prevData.map((item) => item.apiKey));
      // Filter out data with keys that already exist in the state
      const newData = data.filter((item: ApiKey) => !existingKeys.has(item.apiKey));

      return [...prevData, ...newData];
    });
  }, [initialApiKeysData]);

  const handleApiKeyNoteValidation = (evt?: React.FormEvent<HTMLInputElement>) => {
    if (!evt) {
      setInvalidApiKeyNote('');
      return;
    }

    const { value } = evt?.target as HTMLInputElement;

    if (value?.length > MAX_NOTE_LENGTH) {
      setInvalidApiKeyNote(`You cannot enter more than ${MAX_NOTE_LENGTH} characters`);
      return;
    } else setInvalidApiKeyNote('');
  };

  const handleApiKeyNote = (evt?: React.FormEvent<HTMLInputElement>, value?: string) => {
    if (invalidApiKeyNote?.length === 0) {
      const { value: inputValue } = (evt?.target as HTMLInputElement) || {};
      setApiKeyNote(inputValue || (value ?? ''));
    }
  };

  const handleDelete = async () => {
    const apiKey = selectedApiKey;

    try {
      const response = await cloudAPI.apiKey.delete({
        api_key: apiKey,
        user_id: userId,
      });

      if (response?.success) {
        const newData = apiKeyData.filter((data) => data.apiKey !== apiKey);
        setApiKeyData(newData);
      }

      setShowDeleteModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (dataUpdate: ApiKey) => {
    const payload: ApiKeyRequest = {
      api_key: dataUpdate?.apiKey,
      new_note: dataUpdate?.note,
      new_plan_id: PLAN_ID,
      user_id: userId,
    };

    try {
      const response = await cloudAPI.apiKey.update(payload);
      if (response.success) {
        const updatedData = apiKeyData.map((data) => {
          if (data.apiKey === dataUpdate?.apiKey) {
            data.note = dataUpdate.note;
          }

          return data;
        });

        setApiKeyData(updatedData);
      }

      console.log('response update:', response);
    } catch (error) {
      console.error('error updating:', error);
    }
  };

  const columns: ColumnDef<ApiKey, string>[] = useMemo(() => {
    return getColumns({
      onDelete: handleOpenModal,
      onUpdate: handleUpdate,
    });
  }, [handleDelete]);

  const handleCreateApiKey = async () => {
    const payload: ApiKeyRequest = {
      site_id: selectedSiteId,
      user_id: userId,
      org_id: selectedOrgId ?? 'n/a',
      plan_id: PLAN_ID,
      note: apiKeyNote,
    };

    try {
      setStepGeneration('LOADING');
      const response = await cloudAPI.apiKey.create(payload);
      if (response?.success) {
        setApiKeyValue(response?.api_key);
      }

      setStepGeneration('NEW_KEY');
    } catch (err) {
      console.error(err);
    }
  };

  const emptyMessage = () => (
    <div className="flex flex-col items-center justify-center p-[113px]">
      <p className="text-h4 font-bold">No API keys have been created yet.</p>
      <Link
        to={LEARN_MORE_URL}
        target="_blank"
        className="mt-4 cursor-pointer text-sm font-semibold text-blue-brilliant underline"
      >
        Learn more about API Keys
      </Link>
    </div>
  );

  const renderNewKey = () => (
    <div>
      <Field htmlFor="apiKey" label="New API key" labelClass="text-blue-suede my-1 font-medium" labelSize="small">
        <div className="flex items-center gap-3">
          <p id="apiKey" className="text-black-soft">
            {apiKeyValue}
          </p>
          <CopyClipboard text={apiKeyValue} />
        </div>
      </Field>
      <p className="mt-6 font-bold text-black-soft">
        On return visits, you can access this new API key in the table below.
      </p>
      <div className="mt-8 flex w-[400px] gap-4">
        <Button
          size="medium"
          className="w-full"
          onClick={() => setStepGeneration('INITIAL')}
          variant="secondary"
          label="DISMISS"
        />
        <Button
          size="medium"
          className="w-full"
          onClick={() => setStepGeneration('NOTE')}
          variant="primary"
          label="GENERATE NEW KEY"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="relative ">
        <ScrollVisibleElement scrollTitle="API Key">
          <Heading heading="API Key" />
        </ScrollVisibleElement>
        <div className="my-10 flex w-full max-w-[46rem] flex-col gap-[0px] p-0">
          <p>
            Create an API key to connect WellCube (or to share WellCube data) with your other platforms and interfaces.{' '}
            {''}
            <Link to={LEARN_MORE_URL} className="text-blue-brilliant underline" target="_blank">
              Learn more
            </Link>{' '}
            about API keys.
          </p>
        </div>
      </div>
      <div className="relative isolate  ">
        <div className="relative z-[101]">
          {match(stepGeneration)
            .with('INITIAL', () => (
              <Button
                size="medium"
                onClick={() => setStepGeneration('NOTE')}
                variant="primary"
                label="GENERATE API KEY"
              />
            ))
            .with('NOTE', () => (
              <ApiKeyNote
                invalidApiKeyNote={invalidApiKeyNote}
                handleApiKeyNoteValidation={handleApiKeyNoteValidation}
                handleApiKeyNote={handleApiKeyNote}
                handleCreateApiKey={handleCreateApiKey}
                handleStepGeneration={setStepGeneration}
              />
            ))
            .with('NEW_KEY', () => renderNewKey())
            .with('LOADING', () => (
              <div className="flex justify-center p-4">
                <OvalLoader />
              </div>
            ))
            .exhaustive()}
        </div>
        <div className="table-container ">
          <p className=" flex h-[var(--titleonscroll-height)] flex-col justify-end text-h5 font-bold">
            Generated API Keys
          </p>
          <Table
            data={apiKeyData}
            dataLoading={isLoading}
            columns={columns}
            emptyMessage={emptyMessage()}
            isEditEnabled={false}
          />
        </div>
      </div>

      {showDeleteModal && (
        <Modal onClose={handleCloseModal} open={showDeleteModal}>
          <h1 className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">Are you sure?</h1>
          <div>
            Deleting this API key will automatically stop the transmission of data between your third party software and
            WellCube, wherever this API is applied.
          </div>
          <div className="mt-12 flex items-center justify-center gap-3">
            <Button
              size="medium"
              className="min-w-[120px]"
              onClick={() => setShowDeleteModal(false)}
              variant="secondary"
              label="CANCEL"
            />
            <Button size="medium" className="min-w-[120px]" onClick={handleDelete} variant="primary" label="DELETE" />
          </div>
        </Modal>
      )}
    </>
  );
};

export default ClientApiSettings;
