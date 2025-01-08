import { coreAPI } from '../apiSingleton';
import credentialsManager from '../credentialsManager';

export async function getIndustryList(): Promise<Array<string>> {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.lists.getIndustries(installationId);
}

export async function getSortedIndustryList(withOther = false): Promise<Array<string>> {
  const unsortedIndustries = await getIndustryList();

  const sortedIndustries = unsortedIndustries.sort((indA: string, indB: string) => {
    const lowerA = indA.toLowerCase();
    const lowerB = indB.toLowerCase();

    if (lowerA < lowerB) return -1;
    if (lowerA > lowerB) return 1;

    return 0;
  });

  if (withOther) {
    sortedIndustries.push('Other');
  }

  return sortedIndustries;
}

export async function getFirmwareList() {
  const installationId = credentialsManager.getNcentInstallationId();

  return coreAPI.lists.getFirmware(installationId);
}
