import { Button, Input, Modal } from '@ncent-holdings/ux-components';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as siteActions from '../../actions/sites';
import { ColumnDef } from '@tanstack/react-table';
import { Site, Status } from './types';
import { useSites } from '@src/api-hooks/sites/sitesApi';

import { getColumns } from './SitesColsDef';
import { Table } from '../Table';

const CREATED_ON_FORMAT = 'MM/DD/YYYY';

interface SitesProps {
  orgId?: string;
  admin?: boolean;
}

const Sites = ({ orgId = '', admin = false }: SitesProps) => {
  const navigate = useNavigate();

  const { sites, selectById: selectSiteById } = useSites({ organizationId: orgId }, { skip: !orgId });

  const [deleteSiteValidation, setDeleteSiteValidation] = useState<string>('');
  const [deleteSiteError, setDeleteSiteError] = useState<string>('');
  const [deletingSite, setDeletingSite] = useState<boolean>(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | undefined>(undefined);

  const updateDeleteSiteValidation = (evt: React.SyntheticEvent) => {
    const { value: newValue } = evt.target as HTMLInputElement;
    setDeleteSiteValidation(newValue);
  };

  const [modalMeta, setModalMeta] = useState<{
    open: boolean;
    confirmText: string;
    dismissText: string;
  }>({
    open: false,
    confirmText: 'DELETE SITE',
    dismissText: 'CANCEL',
  });

  const sitesTableData: Site[] = sites.map((site) => {
    const siteHandle = site['wellcube/site']?.handle;

    const deviceCount = site['wellcube/spaces']?.meta.total_devices || 0;
    const siteStatus = (site['wellcube/site']?.status || '') as Status;

    return {
      id: site.id,
      site: site.name,
      siteHandle: siteHandle,
      address: [
        site['wellcube/site']?.address1,
        site['wellcube/site']?.address2,
        site['wellcube/site']?.city,
        site['wellcube/site']?.country,
      ]
        .filter(Boolean)
        .join(', '),
      status: siteStatus,
      creationDate: site['wellcube/site']?.created_at
        ? dayjs.unix(+site['wellcube/site']?.created_at).format(CREATED_ON_FORMAT)
        : '',
      totalDevices: deviceCount,
    };
  });

  const handleOrganizationSiteEditClicked = (organizationSiteId: string) => {
    const organizationSite = selectSiteById(organizationSiteId);
    const siteHandle = organizationSite?.['wellcube/site']?.handle;

    if (!siteHandle) {
      return;
    }

    navigate(`sites/${siteHandle}`);
  };

  const promptDeleteSite = (site: Site) => {
    console.log('DELETING SITE: ', { site });

    if (!site.id) {
      throw new Error('Invalid site data.');
    }

    setSiteToDelete(site);
    setModalMeta({
      open: true,
      confirmText: 'DELETE',
      dismissText: 'CANCEL',
    });
  };

  const handleCancelDelete = () => {
    setSiteToDelete(undefined);
    setModalMeta({ ...modalMeta, open: false });
    setDeleteSiteError('');
    setDeleteSiteValidation('');
  };

  const confirmDeleteSite = async (siteToDelete: Site) => {
    if (!siteToDelete || !siteToDelete?.id) {
      setSiteToDelete(undefined);
      setModalMeta({ ...modalMeta, open: false });
      setDeleteSiteError('Cannot delete site - invalid site data');
      return;
    }

    if (deleteSiteValidation !== siteToDelete.siteHandle) {
      setDeleteSiteError('DELETE site validation failed');
      return;
    }

    try {
      setDeletingSite(true);
      const deletedSite = await siteActions.deleteSite(siteToDelete.id);

      setDeleteSiteError('');
      setSiteToDelete(undefined);
      setModalMeta({ ...modalMeta, open: false });

      return deletedSite;
    } catch (err: Error | any) {
      setDeleteSiteError(err.message);
    } finally {
      setDeletingSite(false);
      setDeleteSiteValidation('');
    }
  };

  const renderDevicesInSiteModal = () => {
    return (
      <Modal onClose={handleCancelDelete} open={modalMeta.open}>
        <h1 className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">
          Additional action required
        </h1>
        <div>Please remove all devices before deleting this site.</div>
        <div className="mt-12 flex items-center justify-center gap-3">
          <Button size="large" variant="primary" label="OK" onClick={handleCancelDelete} className="min-w-[140px]" />
        </div>
      </Modal>
    );
  };

  const renderDeleteSiteModal = () => {
    if (!siteToDelete) return <></>;
    console.log(`Got siteToDelete: ${JSON.stringify(siteToDelete, null, 2)}`);

    if (siteToDelete.totalDevices !== 0) {
      return renderDevicesInSiteModal();
    }

    return (
      <Modal onClose={handleCancelDelete} open={modalMeta.open}>
        <>
          {!deletingSite && (
            <div className="mb-12">
              <div className="mb-4 text-[16px]">
                Please enter the Display name{' '}
                <span className="[font-family:menlo,monospace]">({siteToDelete?.siteHandle})</span> for the site in the
                text below and click Submit to delete.
              </div>
              <Input
                classes="[font-family:menlo,monospace]"
                type="text"
                id="delete-site-validation"
                hasError={!!deleteSiteError}
                value={deleteSiteValidation}
                onChange={updateDeleteSiteValidation}
                placeholder={siteToDelete?.siteHandle}
              />
              {deleteSiteError && <div className="text-alert-error">{deleteSiteError}</div>}
            </div>
          )}
        </>
        <>
          {deletingSite && (
            <div className="h-20 self-center text-center [&>*]:fill-blue-brilliant">
              <div>Deleting site...</div>
            </div>
          )}
        </>
        <div className="flex items-center justify-center gap-[50px] ">
          <Button
            size="large"
            variant="inverse"
            label={modalMeta.dismissText}
            onClick={handleCancelDelete}
            className="min-w-[120px]"
          />
          <Button
            size="large"
            variant="primary"
            label={modalMeta.confirmText}
            onClick={() => confirmDeleteSite(siteToDelete)}
            className="min-w-[120px]"
          />
        </div>
      </Modal>
    );
  };

  const handleStatusChange = async (newStatus: string, site: Site) => {
    if (!newStatus) {
      return;
    }

    await siteActions.updateSite(site.id, {
      status: newStatus,
    });
  };

  const columns: ColumnDef<Site, string>[] = useMemo(() => {
    return getColumns(
      {
        onStatusChange: handleStatusChange,
      },
      admin,
    );
  }, [handleStatusChange]);

  return (
    <div className="org-profile-tab-table relative">
      {admin && (
        <div className="absolute right-0 top-[-5.1rem] z-[15]">
          <Button variant="inverse" label="ADD A SITE" size="small" onClick={() => navigate('sites/new')} />
        </div>
      )}

      <Table<Site>
        data={sitesTableData}
        columns={columns}
        isEditEnabled={admin}
        onEdit={handleOrganizationSiteEditClicked}
        onDelete={promptDeleteSite}
        emptyMessage={
          <div className="flex w-full flex-col items-center justify-center rounded-b-2xl bg-white p-[80px]">
            <p className="mb-[24px] text-h4 font-semibold text-grey-900">Your organization has no sites yet</p>
          </div>
        }
      />

      {renderDeleteSiteModal()}
    </div>
  );
};

export default Sites;
