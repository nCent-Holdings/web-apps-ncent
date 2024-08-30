class UxSessionStorage {
  async getItem(key: string): Promise<any> {
    const data = sessionStorage.getItem(key);

    return data ? JSON.parse(data) : data;
  }

  async setItem(key: string, value: any): Promise<void> {
    const data = JSON.stringify(value);

    sessionStorage.setItem(key, data);
  }

  async removeItem(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }
}

export default new UxSessionStorage();
