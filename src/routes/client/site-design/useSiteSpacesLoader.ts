import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { coreAPI } from '@src/apiSingleton';
import credentialsManager from '@src/credentialsManager';

import { SpaceModel } from '@src/api-types/models';
import { useGetSiteDesignSpacesQuery } from '@src/api-hooks/spaces/spacesApi';
import { siteDesignActions } from '@src/features/site-design/siteDesign.slice';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

const useSiteSpacesLoader = () => {
  const dispatch = useDispatch();
  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();

  const { data: spaces = [], isLoading } = useGetSiteDesignSpacesQuery(
    { siteId: selectedSiteId, limit: 1000 },
    { skip: !selectedSiteId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    return () => {
      dispatch(siteDesignActions.clear());
    };
  }, [selectedSiteId]);

  useEffect(() => {
    if (spaces.length > 0) {
      dispatch(siteDesignActions.setSpaces({ spaces }));
    }

    const installationId = credentialsManager.getWellCubeInstallationId();
    try {
      const listener = coreAPI.multiInstallationClient.getListenersManager(installationId).createListener();

      // Update
      const handleUpdate = (nvaObject: SpaceModel) => {
        dispatch(siteDesignActions.updateSpace({ space: nvaObject }));
      };

      spaces.forEach((space) => listener.onUpdate(space.id, handleUpdate));

      // Delete
      const handleDelete = (nvaObject: SpaceModel) => {
        dispatch(siteDesignActions.deleteSpace({ spaceId: nvaObject.id }));
      };

      spaces.forEach((space) => listener.onDelete(space.id, handleDelete));

      // Create
      const createNoun = `wellcube/space.site_id=${selectedSiteId}`;

      listener.onCreate(createNoun, async (nvaObject: SpaceModel) => {
        listener.onUpdate(nvaObject.id, handleUpdate);
        listener.onDelete(nvaObject.id, handleDelete);

        dispatch(siteDesignActions.addSpace({ space: nvaObject }));

        const [createdSpace] = await coreAPI.spaces.getById(nvaObject.id, installationId);

        dispatch(siteDesignActions.updateSpace({ space: createdSpace }));
      });

      return () => {
        listener.remove();
      };
    } catch (err) {
      console.log(err);
    }
  }, [spaces]);

  return { isLoading };
};

export default useSiteSpacesLoader;
