export interface NVAObject {
  id: string;
  name: string;
  tags: Record<string, string>;
  capabilities: Record<string, string>;
  sites: Record<string, string>;
  source: Record<string, string>;
}

export interface DarwinThing extends NVAObject {
  'darwin/thing': {
    strict: boolean;
    reachable: boolean;
  };
}

export interface DarwinUser extends NVAObject {
  // 'darwin/user': {};
}
