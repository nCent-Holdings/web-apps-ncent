import { coreAPI } from '@src/apiSingleton';
import credentialsManager from '@src/credentialsManager';

export type TNva =
  | string
  | {
      noun: string;
      verb: string;
      adverb: unknown;
    };

const nvaBaseQuery = async (nva: TNva) => {
  try {
    const installationId = credentialsManager.getWellCubeInstallationId();

    const data = await coreAPI.multiInstallationClient.executeNVA(nva, installationId);

    return { data };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const error = {
      code: e.code || 'UNKNOWN_ERROR',
      reason: e.reason || e.message,
      message: e.message,
    };

    return { error };
  }
};

export default nvaBaseQuery;
