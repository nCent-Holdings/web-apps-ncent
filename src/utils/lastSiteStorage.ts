const LAST_SELECTED_SITE_STORAGE_KEY = 'lastSelectedSite';

export default {
  getLastSite(orgHandle: string): string {
    const data: TObject = JSON.parse(localStorage.getItem(LAST_SELECTED_SITE_STORAGE_KEY) || '{}');

    return data[orgHandle] || '';
  },
  setLastSite(orgHandle: string, siteHandle: string): void {
    const data: TObject = JSON.parse(localStorage.getItem(LAST_SELECTED_SITE_STORAGE_KEY) || '{}');

    data[orgHandle] = siteHandle;

    localStorage.setItem(LAST_SELECTED_SITE_STORAGE_KEY, JSON.stringify(data));
  },
  removeLastSite(orgHandle: string): void {
    const data: TObject = JSON.parse(localStorage.getItem(LAST_SELECTED_SITE_STORAGE_KEY) || '{}');

    delete data[orgHandle];

    localStorage.setItem(LAST_SELECTED_SITE_STORAGE_KEY, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(LAST_SELECTED_SITE_STORAGE_KEY);
  },
};
