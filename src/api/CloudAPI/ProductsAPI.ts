import { Product } from './models';

import BaseAPI from './BaseAPI';

class ProductsAPI extends BaseAPI {
  async list(params: { name?: string } = {}): Promise<Array<Product>> {
    return this.apiClient.get('products', params);
  }
}

export default ProductsAPI;
