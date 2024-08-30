import { IListener } from '@ncent-holdings/user-gateway-client';
import { Dispatch, EntityAdapter, EntityState } from '@reduxjs/toolkit';
import { NVAObject } from '@src/api-types/core';
import { coreAPI } from '@src/apiSingleton';
import credentialsManager from '@src/credentialsManager';
import sleep from '@src/utils/sleep';

type TGetQueryCacheHandlers<TQueryArgs, TEntity extends NVAObject> = {
  entityAdapter: EntityAdapter<TEntity>;
  createNoun?: (arg: TQueryArgs) => string | string;
  removeOnUpdate?: (nvaObject: TEntity) => boolean;
  handleDataUpdate?: (dispatch: Dispatch, nvaObject: TEntity, arg: TQueryArgs) => void;
  listeners?: Record<string, IListener>;
};

export type MutationCacheLifecycleApi<TEntity> = {
  updateCachedData(callback: (draft: EntityState<TEntity>) => void): void;
  cacheDataLoaded: Promise<{ data: EntityState<TEntity> }>;
  cacheEntryRemoved: Promise<void>;
  dispatch: Dispatch;
};

type QueryLifecycleApi<TEntity> = {
  dispatch: Dispatch;
  queryFulfilled: Promise<{ data: EntityState<TEntity> }>;
  updateCachedData(callback: (draft: EntityState<TEntity>) => void): void;
};

export default function getQueryCacheHandlers<TQueryArgs, TEntity extends NVAObject>(
  params: TGetQueryCacheHandlers<TQueryArgs, TEntity>,
): {
  onCacheEntryAdded: (arg: TQueryArgs, options: MutationCacheLifecycleApi<TEntity>) => Promise<void>;
  onQueryStarted: (arg: TQueryArgs, options: QueryLifecycleApi<TEntity>) => Promise<void>;
} {
  const listeners: Record<string, IListener> = {};
  return {
    onCacheEntryAdded: getUpdateCacheHandler({ ...params, listeners }),
    onQueryStarted: getQueryStartedHandler({ ...params, listeners }),
  };
}

export function getUpdateCacheHandler<TQueryArgs, TEntity extends NVAObject>({
  entityAdapter,
  createNoun,
  removeOnUpdate,
  handleDataUpdate,
  listeners,
}: TGetQueryCacheHandlers<TQueryArgs, TEntity>) {
  return async (
    arg: TQueryArgs,
    { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }: MutationCacheLifecycleApi<TEntity>,
  ) => {
    const { data } = await cacheDataLoaded;

    const installationId = credentialsManager.getWellCubeInstallationId();
    const listener = coreAPI.multiInstallationClient.getListenersManager(installationId).createListener();
    if (listeners) listeners[JSON.stringify(arg)] = listener;

    setListeners(
      data,
      listener,
      entityAdapter,
      updateCachedData,
      arg,
      handleDataUpdate ? { handleDataUpdate, dispatch } : undefined,
      createNoun ? { createNoun, installationId } : undefined,
      removeOnUpdate,
    );

    // Unmount
    await cacheEntryRemoved;

    listener.remove();
  };
}

export function getQueryStartedHandler<TQueryArgs, TEntity extends NVAObject>({
  entityAdapter,
  createNoun,
  removeOnUpdate,
  handleDataUpdate,
  listeners,
}: TGetQueryCacheHandlers<TQueryArgs, TEntity>) {
  return async (arg: TQueryArgs, { dispatch, queryFulfilled, updateCachedData }: QueryLifecycleApi<TEntity>) => {
    const { data } = await queryFulfilled;
    const listener = listeners?.[JSON.stringify(arg)];
    if (listener) {
      const installationId = credentialsManager.getWellCubeInstallationId();
      listener.remove();

      setListeners(
        data,
        listener,
        entityAdapter,
        updateCachedData,
        arg,
        handleDataUpdate ? { handleDataUpdate, dispatch } : undefined,
        createNoun ? { createNoun, installationId } : undefined,
        removeOnUpdate,
      );
    }
  };
}

function setListeners<TQueryArgs, TEntity extends NVAObject>(
  data: EntityState<TEntity>,
  listener: IListener,
  entityAdapter: EntityAdapter<TEntity>,
  updateCachedData: (callback: (draft: EntityState<TEntity>) => void) => void,
  arg?: TQueryArgs,
  updateOptions?: {
    handleDataUpdate: (dispatch: Dispatch, nvaObject: TEntity, arg: TQueryArgs) => void;
    dispatch: Dispatch;
  },
  createOptions?: {
    createNoun: (arg: TQueryArgs) => string | string;
    installationId: string;
  },
  removeOnUpdate?: (nvaObject: TEntity) => boolean,
) {
  // Update
  const handleUpdate = (nvaObject: TEntity) => {
    if (removeOnUpdate && removeOnUpdate(nvaObject)) {
      updateCachedData((draft: EntityState<TEntity>) => entityAdapter.removeOne(draft, nvaObject.id));
    } else {
      updateCachedData((draft: EntityState<TEntity>) => entityAdapter.upsertOne(draft, nvaObject));
    }
    if (updateOptions && arg) updateOptions.handleDataUpdate(updateOptions.dispatch, nvaObject, arg);
  };

  data.ids.forEach((id) => listener.onUpdate(id as string, handleUpdate));

  // Delete
  const handleDelete = (nvaObject: TEntity) => {
    updateCachedData((draft: EntityState<TEntity>) => entityAdapter.removeOne(draft, nvaObject.id));
  };

  data.ids.forEach((id) => listener.onDelete(id as string, handleDelete));

  // Create
  if (createOptions && arg) {
    const noun =
      typeof createOptions.createNoun === 'function' ? createOptions.createNoun(arg) : createOptions.createNoun;

    listener.onCreate(noun, async (createdNvaObject: TEntity) => {
      listener.onUpdate(createdNvaObject.id, handleUpdate);
      listener.onDelete(createdNvaObject.id, handleDelete);

      updateCachedData((draft) => entityAdapter.upsertOne(draft, createdNvaObject));

      // @TODO: Remove after race condition will be fixed
      await sleep(1000);

      const [nvaObject] = await coreAPI.multiInstallationClient.executeNVA(
        `id==${createdNvaObject.id}.get`,
        createOptions.installationId,
      );

      updateCachedData((draft) => entityAdapter.upsertOne(draft, nvaObject));
    });
  }
}
