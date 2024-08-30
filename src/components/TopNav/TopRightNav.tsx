import React, { useState, MouseEvent } from 'react';
import useSession from '../../api-hooks/session/useSession';
import Avatar from '../Avatar/Avatar';
import { DropdownContent, MenuItem } from './DropdownContent';
import Help from './Help';
import TopnavIconNotifications from './icons/TopnavIconNotifications';
import TopnavIconHelp from './icons/TopnavIconHelp';
import Notifications from '../Notifications/Notifications';
import { useParams } from 'react-router-dom';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';
import { twMerge } from 'tailwind-merge';
import { NOTIFICATIONS } from '../NotificationsDropdown/notificationsMock';
import NavItem from './NavItem';

const EXTERNAL_LINK_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSdxR7nFnslvcjOPakJaibuGkjmQvnvFFCRa2hIplLivIGjSrw/viewform?usp=sf_link';

const TopRightNav = () => {
  const [, sessionAPI] = useSession();
  const [activeMenu, setActiveMenu] = useState('');
  const { getAuthorizedUserData, logout } = sessionAPI ?? {};
  let firstName = '';
  let secondName = '';

  const { orgHandle } = useParams<'orgHandle'>();

  // When users log out, this was throwing is throwing an error b/c
  // it tries to decode a JWT token that doesn't exist
  try {
    const userData = getAuthorizedUserData();
    firstName = userData.firstName;
    secondName = userData.secondName;
  } catch (err) {
    // Do nothing
  }

  const menuHelpItems: MenuItem[] = [
    { name: 'Help center', externalLink: 'https://support.delos.com/hc/en-us' },
    {
      name: 'Submit a ticket',
      externalLink: 'https://support.delos.com/hc/en-us',
    },
  ];

  const menuProfileItems: MenuItem[] = [
    {
      name: 'Profile',
      link: orgHandle ? `${orgHandle}/my-account` : 'my-account',
    },
    { name: 'Feature Request', externalLink: EXTERNAL_LINK_FORM },
    { name: 'Sign out', handleClick: logout },
  ];

  const handleOnClick = (event: MouseEvent<HTMLButtonElement>, activeMenu: string) => {
    setActiveMenu((prevActive) => (prevActive === activeMenu ? '' : activeMenu));
  };

  const handleClickOutside = (menu: string) => () => {
    setActiveMenu((prevActive) => (prevActive === menu ? '' : prevActive));
  };

  return (
    <div className="ml-auto mr-[2rem] flex flex-[0_0_auto] items-center gap-x-[1.25rem]">
      <NavItem onClickOutside={handleClickOutside('notifications')}>
        <Notifications
          onClick={(event) => handleOnClick(event, 'notifications')}
          className={twMerge(activeMenu === 'notifications' && 'bg-blue-brilliant')}
          hasNewNotifications={NOTIFICATIONS.some((item) => !item.dateRead)}
        >
          <TopnavIconNotifications
            className={twMerge('-mx-1 h-[1.375rem] w-[1.375rem]', activeMenu === 'notifications' && 'text-white')}
          />
        </Notifications>
        <div className="relative z-10 mt-2">
          {activeMenu === 'notifications' && <NotificationsDropdown notifications={NOTIFICATIONS} />}
        </div>
      </NavItem>
      <NavItem onClickOutside={handleClickOutside('help')}>
        <Help onClick={(event) => handleOnClick(event, 'help')}>
          {<TopnavIconHelp className="h-[1.375rem] w-[1.375rem]" />}
        </Help>
        <div className="relative z-10 mt-2">
          {activeMenu === 'help' && <DropdownContent menuItems={menuHelpItems} classExtendContainer="w-[11.5rem]" />}
        </div>
      </NavItem>
      <NavItem onClickOutside={handleClickOutside('avatar')}>
        <Avatar
          onClick={(event) => handleOnClick(event, 'avatar')}
          firstName={firstName}
          secondName={secondName}
        ></Avatar>
        <div className="relative z-10 mt-2">
          {activeMenu === 'avatar' && (
            <DropdownContent classExtendContainer="w-[11.5rem]" menuItems={menuProfileItems} />
          )}
        </div>
      </NavItem>
    </div>
  );
};

export default TopRightNav;
