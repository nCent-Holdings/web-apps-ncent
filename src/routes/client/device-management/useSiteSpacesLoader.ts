import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { spacesAdapter, useGetSpacesQuery } from '@src/api-hooks/spaces/spacesApi';
import { dmActions } from '@src/features/device-management/dm.slice';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

const useSiteSpacesLoader = () => {
  const dispatch = useDispatch();
  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();

  const { data, isLoading } = useGetSpacesQuery({ siteId: selectedSiteId, limit: 1000 }, { skip: !selectedSiteId });

  useEffect(() => {
    if (!data) {
      return;
    }

    const spaces = spacesAdapter.getSelectors().selectAll(data);

    dispatch(dmActions.setSpaces({ spaces }));
  }, [data]);

  return { isLoading };
};

export default useSiteSpacesLoader;
