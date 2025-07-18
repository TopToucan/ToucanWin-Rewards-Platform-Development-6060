export class ReceiptModel {
  static getReceiptCategories() {
    return {
      'grocery': { multiplier: 1.0, name: 'Grocery', icon: 'FiShoppingCart' },
      'electronics': { multiplier: 1.5, name: 'Electronics', icon: 'FiSmartphone' },
      'clothing': { multiplier: 1.2, name: 'Clothing', icon: 'FiShirt' },
      'restaurant': { multiplier: 1.3, name: 'Restaurant', icon: 'FiCoffee' },
      'gas': { multiplier: 0.8, name: 'Gas Station', icon: 'FiFuel' },
      'pharmacy': { multiplier: 1.1, name: 'Pharmacy', icon: 'FiHeart' },
      'home': { multiplier: 1.0, name: 'Home & Garden', icon: 'FiHome' },
      'entertainment': { multiplier: 1.4, name: 'Entertainment', icon: 'FiFilm' },
      'automotive': { multiplier: 1.2, name: 'Automotive', icon: 'FiTruck' },
      'other': { multiplier: 1.0, name: 'Other', icon: 'FiPackage' }
    };
  }

  static getStoreDatabase() {
    return {
      // Grocery Stores
      'walmart': { category: 'grocery', partnership: true, bonusMultiplier: 1.2, name: 'Walmart' },
      'target': { category: 'grocery', partnership: true, bonusMultiplier: 1.15, name: 'Target' },
      'kroger': { category: 'grocery', partnership: false, bonusMultiplier: 1.0, name: 'Kroger' },
      'safeway': { category: 'grocery', partnership: true, bonusMultiplier: 1.1, name: 'Safeway' },
      'whole foods': { category: 'grocery', partnership: false, bonusMultiplier: 1.0, name: 'Whole Foods' },
      
      // Electronics
      'best buy': { category: 'electronics', partnership: true, bonusMultiplier: 1.3, name: 'Best Buy' },
      'apple store': { category: 'electronics', partnership: false, bonusMultiplier: 1.0, name: 'Apple Store' },
      'amazon': { category: 'electronics', partnership: true, bonusMultiplier: 1.25, name: 'Amazon' },
      
      // Restaurants
      'mcdonalds': { category: 'restaurant', partnership: true, bonusMultiplier: 1.2, name: 'McDonald\'s' },
      'starbucks': { category: 'restaurant', partnership: true, bonusMultiplier: 1.15, name: 'Starbucks' },
      'subway': { category: 'restaurant', partnership: false, bonusMultiplier: 1.0, name: 'Subway' },
      
      // Gas Stations
      'shell': { category: 'gas', partnership: true, bonusMultiplier: 1.1, name: 'Shell' },
      'exxon': { category: 'gas', partnership: false, bonusMultiplier: 1.0, name: 'Exxon' },
      'bp': { category: 'gas', partnership: true, bonusMultiplier: 1.05, name: 'BP' },
      
      // Other
      'cvs': { category: 'pharmacy', partnership: true, bonusMultiplier: 1.1, name: 'CVS Pharmacy' },
      'walgreens': { category: 'pharmacy', partnership: true, bonusMultiplier: 1.1, name: 'Walgreens' },
      'home depot': { category: 'home', partnership: false, bonusMultiplier: 1.0, name: 'Home Depot' },
      'lowes': { category: 'home', partnership: false, bonusMultiplier: 1.0, name: 'Lowe\'s' }
    };
  }

  static getProductDatabase() {
    return {
      // Grocery items
      'milk': { category: 'dairy', points: 2, healthScore: 7 },
      'bread': { category: 'bakery', points: 1, healthScore: 5 },
      'apples': { category: 'produce', points: 3, healthScore: 9 },
      'bananas': { category: 'produce', points: 2, healthScore: 8 },
      'chicken': { category: 'meat', points: 4, healthScore: 7 },
      'eggs': { category: 'dairy', points: 3, healthScore: 8 },
      'yogurt': { category: 'dairy', points: 2, healthScore: 7 },
      'rice': { category: 'pantry', points: 2, healthScore: 6 },
      'pasta': { category: 'pantry', points: 2, healthScore: 5 },
      'tomatoes': { category: 'produce', points: 3, healthScore: 8 },
      
      // Electronics
      'iphone': { category: 'electronics', points: 10, healthScore: 0 },
      'laptop': { category: 'electronics', points: 15, healthScore: 0 },
      'headphones': { category: 'electronics', points: 5, healthScore: 0 },
      'charger': { category: 'electronics', points: 3, healthScore: 0 },
      
      // Restaurant items
      'burger': { category: 'fast-food', points: 1, healthScore: 3 },
      'salad': { category: 'healthy', points: 4, healthScore: 9 },
      'pizza': { category: 'fast-food', points: 1, healthScore: 4 },
      'coffee': { category: 'beverage', points: 2, healthScore: 5 },
      'soda': { category: 'beverage', points: 1, healthScore: 2 }
    };
  }

  static getFraudPatterns() {
    return {
      duplicateThreshold: 0.95, // 95% similarity threshold
      maxDailyAmount: 5000, // Maximum daily spending limit
      maxReceiptsPerHour: 10, // Maximum receipts per hour
      suspiciousStores: [], // Stores flagged for suspicious activity
      commonFraudIndicators: [
        'blurry_text',
        'missing_date',
        'missing_store_name',
        'invalid_total',
        'photoshopped_elements'
      ]
    };
  }

  static processedReceipts = new Map(); // In-memory storage for demo

  static storeProcessedReceipt(receiptData) {
    const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.processedReceipts.set(receiptId, {
      ...receiptData,
      id: receiptId,
      processedAt: new Date().toISOString()
    });
    return receiptId;
  }

  static getProcessedReceipt(receiptId) {
    return this.processedReceipts.get(receiptId);
  }

  static getAllUserReceipts(userId) {
    return Array.from(this.processedReceipts.values())
      .filter(receipt => receipt.userId === userId)
      .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt));
  }

  static getUserReceiptAnalytics(userId) {
    const userReceipts = this.getAllUserReceipts(userId);
    
    if (userReceipts.length === 0) {
      return this.getEmptyAnalytics();
    }

    const totalSpent = userReceipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);
    const totalBidTokens = userReceipts.reduce((sum, receipt) => sum + receipt.bidTokensEarned, 0);
    
    // Category breakdown
    const categorySpending = {};
    const storeFrequency = {};
    const monthlySpending = {};
    
    userReceipts.forEach(receipt => {
      // Category spending
      const category = receipt.storeInfo?.category || 'other';
      categorySpending[category] = (categorySpending[category] || 0) + receipt.totalAmount;
      
      // Store frequency
      const storeName = receipt.storeInfo?.name || 'Unknown';
      storeFrequency[storeName] = (storeFrequency[storeName] || 0) + 1;
      
      // Monthly spending
      const month = new Date(receipt.date).toISOString().substr(0, 7); // YYYY-MM
      monthlySpending[month] = (monthlySpending[month] || 0) + receipt.totalAmount;
    });

    // Health score analysis
    const healthyItems = userReceipts.flatMap(receipt => 
      receipt.items.filter(item => item.healthScore >= 7)
    );
    const avgHealthScore = userReceipts.length > 0 
      ? userReceipts.reduce((sum, receipt) => sum + (receipt.avgHealthScore || 5), 0) / userReceipts.length 
      : 5;

    return {
      totalSpent,
      totalBidTokens,
      totalReceipts: userReceipts.length,
      avgReceiptAmount: totalSpent / userReceipts.length,
      categorySpending,
      storeFrequency,
      monthlySpending,
      healthyItems: healthyItems.length,
      avgHealthScore: Math.round(avgHealthScore * 10) / 10,
      topCategories: Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      frequentStores: Object.entries(storeFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      recentReceipts: userReceipts.slice(0, 10),
      spendingTrends: this.calculateSpendingTrends(monthlySpending)
    };
  }

  static getEmptyAnalytics() {
    return {
      totalSpent: 0,
      totalBidTokens: 0,
      totalReceipts: 0,
      avgReceiptAmount: 0,
      categorySpending: {},
      storeFrequency: {},
      monthlySpending: {},
      healthyItems: 0,
      avgHealthScore: 5,
      topCategories: [],
      frequentStores: [],
      recentReceipts: [],
      spendingTrends: { trend: 'stable', change: 0 }
    };
  }

  static calculateSpendingTrends(monthlySpending) {
    const months = Object.keys(monthlySpending).sort();
    if (months.length < 2) {
      return { trend: 'insufficient_data', change: 0 };
    }

    const currentMonth = monthlySpending[months[months.length - 1]];
    const previousMonth = monthlySpending[months[months.length - 2]];
    
    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    
    let trend = 'stable';
    if (change > 10) trend = 'increasing';
    else if (change < -10) trend = 'decreasing';
    
    return { trend, change: Math.round(change) };
  }
}