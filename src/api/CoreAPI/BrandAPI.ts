import BaseAPI from './BaseAPI';
import { BrandModel } from '@src/api-types/models';

class BrandAPI extends BaseAPI {
  async get(nouns: Array<string> = [], installationId: string): Promise<Array<BrandModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: ['ncent/brand', ...nouns].join('.'),
        verb: 'get',
      },
      installationId,
    );
  }

  async getById(brandId: string, installationId: string): Promise<Array<BrandModel>> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `id=${brandId}`,
        verb: 'get',
      },
      installationId,
    );
  }

  async create(newBrandName: string, newDomain: string, installationId: string): Promise<string> {
    const brandObject = await this.multiInstallationClient.executeNVA(
      {
        noun: `brand_manager`,
        verb: 'create',
        adverb: {
          brandname: newBrandName,
          domain: newDomain,
        },
      },
      installationId,
    );

    console.log(`BrandAPI.create got object: ${JSON.stringify(brandObject)}`);

    const brandId = brandObject[0].data.id;

    return brandId;
  }
}

export default BrandAPI;
