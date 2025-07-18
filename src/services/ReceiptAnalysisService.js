import { ReceiptModel } from '../models/ReceiptModel';

export class ReceiptAnalysisService {
  static analyzeReceipt(ocrData) {
    const { structuredData } = ocrData;
    
    // Store analysis
    const storeInfo = this.analyzeStore(structuredData.storeName);
    
    // Item analysis
    const itemAnalysis = this.analyzeItems(structuredData.items);
    
    // Spending analysis
    const spendingAnalysis = this.analyzeSpending(structuredData.total, storeInfo.category);
    
    // Fraud detection
    const fraudCheck = this.performFraudDetection(structuredData);
    
    // Health score calculation
    const healthScore = this.calculateHealthScore(structuredData.items);
    
    // Business logic application
    const businessLogic = this.applyBusinessLogic(structuredData, storeInfo, itemAnalysis);
    
    return {
      storeInfo,
      itemAnalysis,
      spendingAnalysis,
      fraudCheck,
      healthScore,
      businessLogic,
      recommendations: this.generateRecommendations(structuredData, storeInfo, itemAnalysis)
    };
  }

  static analyzeStore(storeName) {
    const storeDatabase = ReceiptModel.getStoreDatabase();
    const normalizedName = storeName.toLowerCase();
    
    // Find matching store
    let storeInfo = null;
    for (const [key, value] of Object.entries(storeDatabase)) {
      if (normalizedName.includes(key) || key.includes(normalizedName.split(' ')[0])) {
        storeInfo = { ...value, detectedName: storeName };
        break;
      }
    }
    
    // Default to unknown store
    if (!storeInfo) {
      storeInfo = {
        category: 'other',
        partnership: false,
        bonusMultiplier: 1.0,
        name: storeName,
        detectedName: storeName,
        isNewStore: true
      };
    }
    
    return storeInfo;
  }

  static analyzeItems(items) {
    const productDatabase = ReceiptModel.getProductDatabase();
    const categories = ReceiptModel.getReceiptCategories();
    
    const analyzedItems = items.map(item => {
      const normalizedName = item.name.toLowerCase();
      let productInfo = null;
      
      // Find matching product
      for (const [key, value] of Object.entries(productDatabase)) {
        if (normalizedName.includes(key) || key.includes(normalizedName.split(' ')[0])) {
          productInfo = { ...value };
          break;
        }
      }
      
      // Default product info
      if (!productInfo) {
        productInfo = {
          category: 'unknown',
          points: 1,
          healthScore: 5
        };
      }
      
      return {
        ...item,
        ...productInfo,
        pricePerPoint: item.price / productInfo.points
      };
    });
    
    // Calculate category breakdown
    const categoryBreakdown = {};
    let totalHealthScore = 0;
    
    analyzedItems.forEach(item => {
      const category = item.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = {
          count: 0,
          totalSpent: 0,
          items: []
        };
      }
      
      categoryBreakdown[category].count++;
      categoryBreakdown[category].totalSpent += item.price;
      categoryBreakdown[category].items.push(item);
      totalHealthScore += item.healthScore;
    });
    
    return {
      items: analyzedItems,
      categoryBreakdown,
      averageHealthScore: totalHealthScore / analyzedItems.length,
      totalItems: analyzedItems.length,
      highValueItems: analyzedItems.filter(item => item.price > 10),
      healthyItems: analyzedItems.filter(item => item.healthScore >= 7)
    };
  }

  static analyzeSpending(totalAmount, storeCategory) {
    const categories = ReceiptModel.getReceiptCategories();
    const categoryInfo = categories[storeCategory] || categories.other;
    
    // Spending tier analysis
    let spendingTier = 'low';
    if (totalAmount > 100) spendingTier = 'high';
    else if (totalAmount > 50) spendingTier = 'medium';
    
    // Value analysis
    const pricePerItem = totalAmount / 10; // Assume average receipt has 10 items
    let valueRating = 'average';
    if (pricePerItem < 3) valueRating = 'budget';
    else if (pricePerItem > 8) valueRating = 'premium';
    
    return {
      totalAmount,
      storeCategory,
      categoryMultiplier: categoryInfo.multiplier,
      spendingTier,
      valueRating,
      isHighValue: totalAmount > 100,
      isBulkPurchase: totalAmount > 150
    };
  }

  static performFraudDetection(structuredData) {
    const fraudPatterns = ReceiptModel.getFraudPatterns();
    const issues = [];
    let riskScore = 0;
    
    // Check for missing required fields
    if (!structuredData.storeName || structuredData.storeName.length < 3) {
      issues.push('missing_store_name');
      riskScore += 0.3;
    }
    
    if (!structuredData.date) {
      issues.push('missing_date');
      riskScore += 0.2;
    }
    
    if (!structuredData.total || structuredData.total <= 0) {
      issues.push('invalid_total');
      riskScore += 0.4;
    }
    
    // Check for suspicious amounts
    if (structuredData.total > fraudPatterns.maxDailyAmount) {
      issues.push('suspicious_amount');
      riskScore += 0.5;
    }
    
    // Check date validity
    const receiptDate = new Date(structuredData.date);
    const today = new Date();
    const daysDiff = (today - receiptDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 90) {
      issues.push('old_receipt');
      riskScore += 0.2;
    }
    
    if (daysDiff < 0) {
      issues.push('future_date');
      riskScore += 0.6;
    }
    
    // Calculate final risk level
    let riskLevel = 'low';
    if (riskScore > 0.7) riskLevel = 'high';
    else if (riskScore > 0.4) riskLevel = 'medium';
    
    return {
      riskScore: Math.round(riskScore * 100) / 100,
      riskLevel,
      issues,
      isValid: riskScore < 0.5,
      confidence: Math.max(0, 1 - riskScore)
    };
  }

  static calculateHealthScore(items) {
    if (!items || items.length === 0) return 5;
    
    const productDatabase = ReceiptModel.getProductDatabase();
    let totalHealthScore = 0;
    let scoredItems = 0;
    
    items.forEach(item => {
      const normalizedName = item.name.toLowerCase();
      for (const [key, value] of Object.entries(productDatabase)) {
        if (normalizedName.includes(key)) {
          totalHealthScore += value.healthScore;
          scoredItems++;
          break;
        }
      }
    });
    
    // Default health score for unrecognized items
    const unscored = items.length - scoredItems;
    totalHealthScore += unscored * 5; // Default score of 5
    
    return Math.round((totalHealthScore / items.length) * 10) / 10;
  }

  static applyBusinessLogic(structuredData, storeInfo, itemAnalysis) {
    // Base points calculation: 1 point per dollar spent
    let basePoints = Math.floor(structuredData.total);
    
    // Base bid tokens: 1 token per dollar spent
    let bidTokens = Math.floor(structuredData.total);
    
    // Apply store category multiplier
    const categoryMultiplier = ReceiptModel.getReceiptCategories()[storeInfo.category]?.multiplier || 1.0;
    let categoryBonusPoints = Math.floor(basePoints * (categoryMultiplier - 1));
    
    // Apply partnership bonus
    let partnershipBonusPoints = 0;
    let partnershipBonusTokens = 0;
    if (storeInfo.partnership) {
      partnershipBonusPoints = Math.floor(basePoints * (storeInfo.bonusMultiplier - 1));
      partnershipBonusTokens = Math.floor(bidTokens * 0.1); // 10% bonus tokens for partners
    }
    
    // Spending tier bonuses
    let spendingBonusPoints = 0;
    let spendingBonusTokens = 0;
    if (structuredData.total > 150) {
      spendingBonusPoints = 50; // Large purchase bonus
      spendingBonusTokens = 10;
    } else if (structuredData.total > 75) {
      spendingBonusPoints = 25; // Medium purchase bonus
      spendingBonusTokens = 5;
    }
    
    // Health bonus
    let healthBonusPoints = 0;
    if (itemAnalysis.averageHealthScore > 7) {
      healthBonusPoints = Math.floor(basePoints * 0.2); // 20% bonus for healthy purchases
    }
    
    // Item-specific bonuses
    let itemBonusPoints = 0;
    itemAnalysis.items.forEach(item => {
      if (item.category === 'produce') {
        itemBonusPoints += 2; // Bonus for fresh produce
      }
    });
    
    // Time-based bonuses
    let timeBonusPoints = 0;
    const receiptDate = new Date(structuredData.date);
    const dayOfWeek = receiptDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend shopping
      timeBonusPoints = Math.floor(basePoints * 0.1); // 10% weekend bonus
    }
    
    // Calculate totals
    const totalPoints = basePoints + categoryBonusPoints + partnershipBonusPoints + 
                      spendingBonusPoints + healthBonusPoints + itemBonusPoints + timeBonusPoints;
    
    const totalBidTokens = bidTokens + partnershipBonusTokens + spendingBonusTokens;
    
    return {
      basePoints,
      bidTokens,
      bonuses: {
        category: categoryBonusPoints,
        partnership: partnershipBonusPoints,
        spending: spendingBonusPoints,
        health: healthBonusPoints,
        items: itemBonusPoints,
        timing: timeBonusPoints,
        partnershipTokens: partnershipBonusTokens,
        spendingTokens: spendingBonusTokens
      },
      totals: {
        points: totalPoints,
        bidTokens: totalBidTokens
      },
      multipliers: {
        category: categoryMultiplier,
        partnership: storeInfo.bonusMultiplier
      }
    };
  }

  static generateRecommendations(structuredData, storeInfo, itemAnalysis) {
    const recommendations = [];
    
    // Store recommendations
    if (!storeInfo.partnership) {
      recommendations.push({
        type: 'store_suggestion',
        title: 'Try Partner Stores',
        message: `Shop at partner stores like Walmart or Target to earn bonus points!`,
        action: 'view_partners'
      });
    }
    
    // Health recommendations
    if (itemAnalysis.averageHealthScore < 6) {
      recommendations.push({
        type: 'health_tip',
        title: 'Boost Your Health Score',
        message: 'Add more fruits and vegetables to earn health bonuses!',
        action: 'health_tips'
      });
    }
    
    // Spending recommendations
    if (structuredData.total < 50) {
      recommendations.push({
        type: 'spending_tip',
        title: 'Maximize Your Points',
        message: 'Combine purchases to reach spending tiers for bonus points!',
        action: 'spending_guide'
      });
    }
    
    // Category recommendations
    const categories = Object.keys(itemAnalysis.categoryBreakdown);
    if (!categories.includes('produce')) {
      recommendations.push({
        type: 'category_suggestion',
        title: 'Fresh Produce Bonus',
        message: 'Buy fresh fruits and vegetables to earn extra points!',
        action: 'category_guide'
      });
    }
    
    return recommendations;
  }
}