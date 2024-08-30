import BaseAPI from './BaseAPI';

class ListsAPI extends BaseAPI {
  async getIndustries(installationId: string): Promise<Array<string>> {
    const listResp = await this.multiInstallationClient.executeNVA(
      {
        noun: 'industry_list==type',
        verb: 'get',
      },
      installationId,
    );

    const iList = listResp?.[0]?.['base/object']?.values?.list;
    return iList;
  }

  async getFirmware(installationId: string) {
    const fwResp = await this.multiInstallationClient.executeNVA(
      {
        noun: '(wellcube/firmware_package.is_latest==true)',
        verb: 'get',
      },
      installationId,
    );

    return fwResp;
  }
}

export default ListsAPI;
