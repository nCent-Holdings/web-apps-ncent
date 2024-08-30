import BaseAPI from './BaseAPI';
import { OrganizationModel } from '@src/api-types/models';
import { type CreateOrUpdateOrganizationDto, type UpdateSalesManagerDto } from '@src/api/CoreAPI/types';

class OrganizationsAPI extends BaseAPI {
  async get(
    {
      organizationId,
      orgName,
      orgHandle,
      limit,
    }: { organizationId?: string; orgName?: string; orgHandle?: string; limit?: number },
    installationId: string,
  ): Promise<Array<OrganizationModel>> {
    const organizationsNounParts = ['(wellcube/organization.deleted_at==)'];

    if (organizationId) {
      organizationsNounParts.push(`id==${organizationId}`);
    }

    if (orgName) {
      organizationsNounParts.push(`name==${orgName}`);
    }

    if (orgHandle) {
      organizationsNounParts.push(`(wellcube/organization.handle==${orgHandle})`);
    }

    if (limit) {
      organizationsNounParts.push(`limit=${limit}`);
    }

    return this.multiInstallationClient.executeNVA(
      {
        noun: organizationsNounParts.join('.'),
        verb: 'get',
      },
      installationId,
    );
  }

  async update(orgId: string, orgData: Partial<CreateOrUpdateOrganizationDto>, installationId: string): Promise<void> {
    try {
      return this.multiInstallationClient.executeNVA(
        {
          noun: `id==${orgId}`,
          verb: 'wellcube/organization/update',
          adverb: orgData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating existing Organization: ', { err });
      throw new Error(`Error updating existing Organization: ${err}`);
    }
  }

  async create(orgData: CreateOrUpdateOrganizationDto, installationId: string): Promise<any> {
    try {
      return this.multiInstallationClient.executeNVA(
        {
          noun: this.wellcubeApiNoun,
          verb: 'wellcube/organizations/create',
          adverb: orgData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error creating Organization: ', { err });
      throw new Error(`Error creating Organization: ${err}`);
    }
  }

  async countOrgSites(organizationId: string, installationId: string): Promise<number> {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `(wellcube/site.organization_id=${organizationId})`,
        verb: 'count',
      },
      installationId,
    );
  }

  async deleteOrg(orgId: string, installationId: string): Promise<void> {
    await this.multiInstallationClient.executeNVA(
      {
        noun: `id==${orgId}`,
        verb: 'wellcube/organization/delete',
      },
      installationId,
    );
  }

  async addAdmin(orgId: string, userId: string, installationId: string) {
    return this.multiInstallationClient.executeNVA(
      {
        noun: `id==${orgId}`,
        verb: `wellcube/organization/add_admin`,
        adverb: `user_id=${userId}`,
      },
      installationId,
    );
  }

  async removeAdmin(orgId: string, userId: string, installationId: string): Promise<OrganizationModel> {
    try {
      return await this.multiInstallationClient.executeNVA(
        {
          noun: `id==${orgId}`,
          verb: `wellcube/organization/remove_admin`,
          adverb: {
            user_id: userId,
          },
        },
        installationId,
      );
    } catch (err: any) {
      throw Error(`Error on remove organization admin access: ${err.reason}`);
    }
  }

  async validateHandle(
    { orgHandle, organizationId }: { orgHandle: string; organizationId?: string },
    installationId: string,
  ): Promise<{ isValid: boolean; errorText?: string }> {
    try {
      await this.multiInstallationClient.executeNVA(
        {
          noun: this.wellcubeApiNoun,
          verb: 'wellcube/organizations/validate_org_handle',
          adverb: { handle: orgHandle, organization_id: organizationId },
        },
        installationId,
      );

      return { isValid: true };
    } catch (error: any) {
      return {
        isValid: false,
        errorText: error,
      };
    }
  }

  async updateSalesManager(
    orgId: string,
    salesManagerData: Partial<UpdateSalesManagerDto>,
    installationId: string,
  ): Promise<void> {
    try {
      return this.multiInstallationClient.executeNVA(
        {
          noun: `id==${orgId}`,
          verb: 'wellcube/organization/update_sales_manager',
          adverb: salesManagerData,
        },
        installationId,
      );
    } catch (err) {
      console.error('Error updating Wellcube Contact: ', { err });
      throw new Error(`Error updating Wellcube Contact: ${err}`);
    }
  }
}

export default OrganizationsAPI;
