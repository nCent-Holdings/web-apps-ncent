import { CredentialsManager } from '@ncent-holdings/user-gateway-client';

class WellCubeCredentialsManager extends CredentialsManager {
  _wellCubeCoreId?: string;
  _wellCubeRoles?: string[];

  clear() {
    this._wellCubeCoreId = undefined;
    this._wellCubeRoles = [];

    super.clear();
  }

  setWellCubeCoreId(wellCubeCoreId: string): void {
    this._wellCubeCoreId = wellCubeCoreId;
  }

  getWellCubeInstallationId(): string {
    return this._wellCubeCoreId || '';
  }

  setWellCubeRoles(roles: string[]): void {
    this._wellCubeRoles = roles;
  }

  getWellCubeRoles(): string[] {
    return this._wellCubeRoles || [];
  }
}

export default WellCubeCredentialsManager;
