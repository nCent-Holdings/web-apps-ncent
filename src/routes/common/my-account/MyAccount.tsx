import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Heading } from '@ncent-holdings/ux-components';

import * as userCoreAPI from '@src/actions/user';

import { useUser } from '@src/api-hooks/users/usersApi';
import useUserCloudData from '@src/api-hooks/session/useUserCloudData';

import ScrollVisibleElement from '@src/components/ScrollVisibleElement/ScrollVisibleElement';
import Container from '@src/components/Layout/Container/Container';
import Tabs, { TabData } from '@src/components/Tabs';
import EditSection, { type EditSectionItem, type TValidateCallback } from '@src/components/EditSection';

import Sites from './Sites/Sites';
import Notifications from './Notifications/Notifications';
import Password from './Password/Password';
import credentialsManager from '@src/credentialsManager';
import { arrayToObject } from '@src/utils';

export const MyAccount = () => {
  const [profileData, setProfileData] = useState<EditSectionItem[]>();

  const wcInstallationId = credentialsManager.getNcentInstallationId();
  const wcCredentials = credentialsManager.get(wcInstallationId);
  const userCoreId = wcCredentials.manipulatorId;

  const userCloudData = useUserCloudData();
  const { user: userCore } = useUser(userCoreId);

  const validatePhoneNumber: TValidateCallback = async (phone: string) => {
    const { isValid, errorMessage } = await userCoreAPI.phoneUserValidate(userCoreId, phone);

    if (!isValid && errorMessage === 'Phone number is required') {
      return {
        isValid,
        errorMessage: 'Phone number field should not be blank',
      };
    }

    return { isValid, errorMessage };
  };

  const loadProfileData = (): EditSectionItem[] => {
    return [
      {
        key: 'email',
        title: 'Email',
        titleClassExtend: 'text-grey-light-500',
        value: userCloudData?.email || '',
        readOnly: true,
      },
      {
        key: 'first_name',
        title: 'First Name',
        titleClassExtend: 'text-grey-light-500',
        value: (userCore?.['wellcube/user']?.first_name || userCloudData?.firstName) ?? '',
      },
      {
        key: 'second_name',
        title: 'Last Name',
        titleClassExtend: 'text-grey-light-500',
        value: (userCore?.['wellcube/user']?.second_name || userCloudData?.secondName) ?? '',
      },
      {
        key: 'phone_number',
        title: 'Phone number',
        titleClassExtend: 'text-grey-light-500',
        value: userCore?.['wellcube/user']?.phone_number || '',
        validate: validatePhoneNumber,
        type: 'phone',
      },
    ];
  };

  useEffect(() => {
    if (!userCore && !userCloudData) return;
    setProfileData(loadProfileData());
  }, [userCore]);

  const tabs: TabData[] = [
    {
      label: 'SITES',
      content: <Sites />,
    },
    {
      label: 'NOTIFICATIONS',
      content: <Notifications userData={userCore?.['wellcube/user']} userId={userCoreId} />,
    },
    {
      label: 'PASSWORD',
      content: <Password email={userCloudData?.email || ''} />,
    },
  ];

  const handleOnEdit = async (editedItems: { key: string; value: string }[]) => {
    await userCoreAPI.updateUser(userCoreId, arrayToObject(editedItems));
  };

  return (
    <>
      <ScrollVisibleElement scrollTitle="Profile & preferences">
        <Heading heading="Profile & preferences" />
      </ScrollVisibleElement>
      <div className="flex w-full flex-col gap-[0px] py-5">
        {profileData && <EditSection data={profileData} onEdit={handleOnEdit} />}
        <Container className={twMerge('relative isolate mt-8 border-t border-t-card-stroke pt-8')}>
          <div className="relative [&_.com-tabs-panel]:relative [&_.com-tabs-panel]:z-[1] [&_.com-tabs-tabs]:relative [&_.com-tabs-tabs]:z-[2]">
            <Tabs tabs={tabs} />
          </div>
        </Container>
      </div>
    </>
  );
};

export default MyAccount;
