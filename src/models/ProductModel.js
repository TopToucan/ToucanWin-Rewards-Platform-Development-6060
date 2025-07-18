export class ProductModel {
  static getRecommendedProducts() {
    return [
      {
        id: 1,
        name: "Premium Wireless Earbuds",
        points: 1500,
        category: "Electronics",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=400",
        popularity: "Hot"
      },
      {
        id: 2,
        name: "Smart Fitness Watch",
        points: 2000,
        category: "Wearables",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400",
        popularity: "Trending"
      },
      {
        id: 3,
        name: "Eco-Friendly Water Bottle",
        points: 800,
        category: "Lifestyle",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400",
        popularity: "New"
      }
    ];
  }
}