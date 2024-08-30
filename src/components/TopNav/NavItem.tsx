import useOutsideClickHandler from '@src/hooks/useOutsideClickHandler';
import React, { ReactNode } from 'react';

export default function NavItem({ onClickOutside, children }: { onClickOutside: () => void; children: ReactNode }) {
  const wrapDropdownRef = React.useRef(null);

  useOutsideClickHandler(wrapDropdownRef, () => {
    onClickOutside();
  });

  return <div ref={wrapDropdownRef}>{children}</div>;
}
