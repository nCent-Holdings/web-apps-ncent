import { CredentialsManager } from '@ncent-holdings/user-gateway-client';

class NcentCredentialsManager extends CredentialsManager {
  _ncentCoreId?: string;
  _ncentRoles?: string[];

  clear() {
    this._ncentCoreId = undefined;
    this._ncentRoles = [];

    super.clear();
  }

  setNcentCoreId(wellCubeCoreId: string): void {
    this._ncentCoreId = wellCubeCoreId;
  }

  getNcentInstallationId(): string {
    return this._ncentCoreId || '';
  }

  setNcentRoles(roles: string[]): void {
    this._ncentRoles = roles;
  }

  getNcentRoles(): string[] {
    return this._ncentRoles || [];
  }
}

export default NcentCredentialsManager;
