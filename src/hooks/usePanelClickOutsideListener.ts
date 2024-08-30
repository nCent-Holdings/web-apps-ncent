import { useEffect, useRef } from 'react';
import { useAppNav } from '../contexts/AppNavContext/AppNavContext';

export const usePanelClickOutsideListener = () => {
  const appNav = useAppNav();
  const panelRef = useRef<HTMLDivElement>(null);
  const handleClickInPage = (evt: any) => {
    if (!panelRef.current || panelRef.current.contains(evt.target)) {
      if (appNav.rightPanelState !== 'full') {
        appNav.expandRightPanel();
      }
    } else if (evt.target.innerText === 'EDIT' || evt.target.getAttribute('data-keep-right-panel') === 'true') {
      // Do nothing if we click the 'EDIT' button
      // TODO: Use an ID for this instead, or find alternate method - ref would be ideal
    } else if (appNav.rightPanelState == 'full') {
      appNav.shrinkRightPanel();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickInPage);

    return () => {
      document.removeEventListener('click', handleClickInPage);
    };
  }, [appNav.rightPanelState]);

  return panelRef;
};
