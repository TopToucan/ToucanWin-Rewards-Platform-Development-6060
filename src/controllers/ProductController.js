import { ProductModel } from '../models/ProductModel';

export class ProductController {
  static getRecommendedProducts() {
    return ProductModel.getRecommendedProducts();
  }
}