import BaseAPI from './BaseAPI';
import { OrgSiteModel } from '@src/api-types/models';
import credentialsManager from '../../credentialsManager';
import { CreateOrUpdateSiteDto } from './types';

class SitesAPI extends BaseAPI {
  async get(
    {
      siteId,
      siteName,
      siteHandle,
      organizationId,
      limit,
    }: { siteId?: string; siteName?: string; siteHandle?: string; organizationId?: string; limit?: number },
    installationId: string,
  ): Promise<Array<OrgSiteModel>> {
    const sitesNounParts = ['wellcube/site'];

    if (siteId) {
      sitesNounParts.push(`id==${siteId}`);
    }

    if (siteName) {
      sitesNounParts.push(`name==${siteName}`);
    }

    if (siteHandle) {
      sitesNounParts.push(`(wellcube/site.handle==${siteHandle})`);
    }

    if (organizationId) {
      sitesNounParts.push(`(wellcube/site.organization_id==${organizationId})`);
    }

    if (limit) {
      sitesNounParts.push(`limit=${limit}`);
    }

    return this.multiInstallationClient.executeNVA(
      {
        noun: sitesNounParts.join('.'),
        verb: 'get',
      },
      installationId,
    );
  }

  async validateName(
    organizationId: string,
    siteName: string,
    siteId: string,
    installationId: string,
  ): Promise<{ isValid: boolean; errorText?: string }> {
    // Make sure the name isn't empty
    if (siteName === '') {
      return { isValid: false, errorText: 'Site name cannot be empty.' };
    }
    // Make sure the name doesn't have any invalid characters
    // } else if (false /* Contains bad characters */) {
    //   return {
    //     isValid: false,
    //     errorText: 'Site name contains invalid characters.',
    //   };
    // }

    // If the name itself is valid, make sure it's unique for this org
    const orgSite = await this.get({ organizationId, siteName }, installationId);
    const otherSites = orgSite.filter((site: { id: string }) => site.id !== siteId);

    // If it's not unique then the site name is not valid
    if (otherSites.length > 0) {
      return {
        isValid: false,
        errorText: `Site name "${siteName}" is already in use. Please specify a site handle or use a different site name.`,
      };
    }

    return { isValid: true };
  }

  async validateHandle(
    { organizationId, siteHandle, siteId }: { organizationId: string; siteHandle: string; siteId?: string },
    installationId: string,
  ): Promise<{ isValid: boolean; errorText?: string }> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${organizationId}`,
          verb: 'wellcube/sites/validate_site_handle',
          adverb: { handle: siteHandle, site_id: siteId },
        },
        installationId,
      );
    } catch (error: any) {
      return {
        isValid: false,
        errorText: error,
      };
    }

    return { isValid: true };
  }

  async deleteSite(orgSiteNvaId: string, installationId: string): Promise<OrgSiteModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${orgSiteNvaId}`,
          verb: 'wellcube/site/delete',
        },
        installationId,
      );
    } catch (err) {
      console.error(`Error deleting org site (${orgSiteNvaId}):`, { err });
      throw Error(`Error deleting org site (${orgSiteNvaId}): ${err}`);
    }
  }

  async updateSite(
    siteId: string,
    siteData: Partial<CreateOrUpdateSiteDto> = {},
    installationId: string,
  ): Promise<OrgSiteModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${siteId}`,
          verb: 'wellcube/site/update',
          adverb: siteData,
        },
        installationId,
      );
    } catch (err) {
      throw Error(`Error updating existing site: ${err}`);
    }
  }

  async createSite(
    organizationId: string,
    siteData: CreateOrUpdateSiteDto,
    installationId: string,
  ): Promise<OrgSiteModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${organizationId}`,
          verb: 'wellcube/sites/create',
          adverb: siteData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error creating new site: ', { err });
      throw Error(`Error creating new site: ${err}`);
    }
  }

  async setActiveSchedule({
    siteId,
    days,
    time_start,
    time_end,
  }: {
    siteId: string;
    days: string[];
    time_start: string;
    time_end: string;
  }): Promise<OrgSiteModel> {
    const wcInstallationId = credentialsManager.getNcentInstallationId();

    try {
      const updSite = await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${siteId}`,
          verb: 'wellcube/site/set_active_schedule',
          adverb: { days, time_start, time_end },
        },
        wcInstallationId,
      );

      console.log(`Updated site's active schedule!: `, { updSite });
      return updSite;
    } catch (err) {
      console.error('Error updating site schedule: ', { err });
      throw new Error(`Error updating site schedule: ${err}`);
    }
  }

  async setActiveDays({
    siteId,
    days,
  }: {
    siteId: string;
    days: string[];
    time_start: string;
    time_end: string;
  }): Promise<OrgSiteModel> {
    const wcInstallationId = credentialsManager.getNcentInstallationId();

    try {
      const updSite = await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${siteId}`,
          verb: 'wellcube/site/set_active_days',
          adverb: { days },
        },
        wcInstallationId,
      );

      console.log(`Updated site's active schedule!: `, { updSite });
      return updSite;
    } catch (err) {
      console.error('Error updating site schedule: ', { err });
      throw new Error(`Error updating site schedule: ${err}`);
    }
  }

  async setActiveHours({
    siteId,
    time_start,
    time_end,
  }: {
    siteId: string;
    days: string[];
    time_start: string;
    time_end: string;
  }): Promise<OrgSiteModel> {
    const wcInstallationId = credentialsManager.getNcentInstallationId();

    try {
      const updSite = await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${siteId}`,
          verb: 'wellcube/site/set_active_hours',
          adverb: { time_start, time_end },
        },
        wcInstallationId,
      );

      console.log(`Updated site's active schedule!: `, { updSite });
      return updSite;
    } catch (err) {
      console.error('Error updating site schedule: ', { err });
      throw new Error(`Error updating site schedule: ${err}`);
    }
  }

  async addAdmin(sites: string[], userId: string, installationId: string) {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `(${sites.map((siteId) => `(id==${siteId})`).join('|')})`,
        verb: `wellcube/site/add_admin`,
        adverb: `user_id=${userId}`,
      },
      installationId,
    );
  }

  async addExternal(sites: string[], userId: string, installationId: string) {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `(${sites.map((siteId) => `(id==${siteId})`).join('|')})`,
        verb: `wellcube/site/add_external`,
        adverb: `user_id=${userId}`,
      },
      installationId,
    );
  }

  async removeAdmin(siteId: string, userId: string, installationId: string): Promise<OrgSiteModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${siteId}`,
          verb: `wellcube/site/remove_admin`,
          adverb: {
            user_id: userId,
          },
        },
        installationId,
      );
    } catch (err: any) {
      throw new Error(`Error on remove site admin access: ${err.reason}`);
    }
  }

  async removeExternal(siteId: string, userId: string, installationId: string): Promise<OrgSiteModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${siteId}`,
          verb: `wellcube/site/remove_external`,
          adverb: {
            user_id: userId,
          },
        },
        installationId,
      );
    } catch (err: any) {
      throw new Error(`Error on remove site admin access: ${err.reason}`);
    }
  }
}

export default SitesAPI;
