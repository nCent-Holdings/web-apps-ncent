import React, { useState, MouseEvent } from 'react';
import useSession from '../../api-hooks/session/useSession';
import Avatar from '../Avatar/Avatar';
import { DropdownContent, MenuItem } from './DropdownContent';
import Help from './Help';
import TopnavIconHelp from './icons/TopnavIconHelp';
import { useParams } from 'react-router-dom';
import NavItem from './NavItem';

const EXTERNAL_LINK_FORM = 'https://theonion.com';

const TopRightNav = () => {
  const [, sessionAPI] = useSession();
  const [activeMenu, setActiveMenu] = useState('');
  const { getAuthorizedUserData, logout } = sessionAPI ?? {};
  let firstName = '';
  let secondName = '';
  let fullName = '';

  const { orgHandle } = useParams<'orgHandle'>();

  /**
   * A helper function that splits `fullName` into { firstName, secondName }.
   * - If 0 names => both ''.
   * - If 1 name => firstName gets that name, secondName = ''.
   * - If 2 or more => secondName = last "word", firstName = everything else.
   */
  function splitFullNameToFirstAndSecond(fullName: string): { firstName: string; secondName: string } {
    let fn = '';
    let sn = '';

    const trimmed = fullName.trim();
    if (!trimmed) {
      // no names
      return { firstName: '', secondName: '' };
    }

    // split on 1+ spaces
    const parts = trimmed.split(/\s+/);

    if (parts.length === 1) {
      // only one name
      fn = parts[0];
      sn = '';
    } else {
      // 2+ names
      sn = parts[parts.length - 1];
      fn = parts.slice(0, parts.length - 1).join(' ');
    }

    return { firstName: fn, secondName: sn };
  }

  // When users log out, this was throwing is throwing an error b/c
  // it tries to decode a JWT token that doesn't exist
  try {
    const userData = getAuthorizedUserData();
    fullName = userData.name;
    firstName = userData.firstName;
    secondName = userData.secondName;

    // If both firstName and secondName are empty, try splitting fullName
    if (!firstName && !secondName && fullName) {
      const { firstName: f, secondName: s } = splitFullNameToFirstAndSecond(fullName);
      firstName = f;
      secondName = s;
    }
  } catch (err) {
    // Do nothing
  }

  const menuHelpItems: MenuItem[] = [
    { name: 'Help center', externalLink: 'https://ncent.me' },
    {
      name: 'Submit a ticket',
      externalLink: 'https://ticketmaster.com',
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
