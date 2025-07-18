import { OCRService } from '../services/OCRService';
import { ReceiptAnalysisService } from '../services/ReceiptAnalysisService';
import { ReceiptModel } from '../models/ReceiptModel';
import { BidTokenModel } from '../models/BidTokenModel';
import { UserController } from './UserController';

export class AdvancedReceiptController {
  static async processReceipt(file, userId) {
    try {
      // Step 1: OCR Processing
      console.log('Starting OCR processing...');
      const ocrResults = await OCRService.processReceiptImage(file);
      
      if (!ocrResults.success) {
        return {
          success: false,
          error: 'OCR processing failed',
          details: ocrResults.error,
          suggestions: ocrResults.suggestions
        };
      }
      
      // Step 2: Receipt Analysis
      console.log('Analyzing receipt data...');
      const analysis = ReceiptAnalysisService.analyzeReceipt(ocrResults);
      
      // Step 3: Fraud Detection
      if (!analysis.fraudCheck.isValid) {
        return {
          success: false,
          error: 'Receipt failed validation',
          fraudCheck: analysis.fraudCheck,
          riskLevel: analysis.fraudCheck.riskLevel
        };
      }
      
      // Step 4: Store processed receipt
      const receiptData = {
        userId,
        fileName: file.name,
        fileSize: file.size,
        ocrResults,
        analysis,
        ...ocrResults.structuredData,
        storeInfo: analysis.storeInfo,
        pointsEarned: analysis.businessLogic.totals.points,
        bidTokensEarned: analysis.businessLogic.totals.bidTokens,
        healthScore: analysis.healthScore,
        avgHealthScore: analysis.itemAnalysis.averageHealthScore
      };
      
      const receiptId = ReceiptModel.storeProcessedReceipt(receiptData);
      
      // Step 5: Award points to user
      const pointsResult = UserController.addPoints(
        userId,
        analysis.businessLogic.totals.points,
        'receipt_processing',
        {
          receiptId,
          storeName: analysis.storeInfo.name,
          amount: ocrResults.structuredData.total
        }
      );
      
      // Step 6: Award bid tokens
      const bidTokenResult = BidTokenModel.addBidTokens(
        userId,
        analysis.businessLogic.totals.bidTokens,
        'receipt_processing',
        {
          receiptId,
          storeName: analysis.storeInfo.name,
          amount: ocrResults.structuredData.total,
          dollarAmount: ocrResults.structuredData.total
        }
      );
      
      // Step 7: Check for achievements and milestones
      const achievementResults = await this.checkAchievements(userId, receiptData);
      
      return {
        success: true,
        receiptId,
        ocrResults,
        analysis,
        pointsEarned: analysis.businessLogic.totals.points,
        bidTokensEarned: analysis.businessLogic.totals.bidTokens,
        bidTokenBalance: bidTokenResult.newBalance,
        levelUp: pointsResult.levelUp,
        newLevel: pointsResult.newLevel,
        previousLevel: pointsResult.previousLevel,
        achievements: achievementResults,
        recommendations: analysis.recommendations,
        processingTime: ocrResults.processingTime
      };
      
    } catch (error) {
      console.error('Receipt processing error:', error);
      return {
        success: false,
        error: 'Processing failed',
        details: error.message
      };
    }
  }
  
  static async checkAchievements(userId, receiptData) {
    const achievements = {
      badges: [],
      stars: [],
      milestones: []
    };
    
    // Get user's receipt history
    const userReceipts = ReceiptModel.getAllUserReceipts(userId);
    const totalReceipts = userReceipts.length;
    const totalSpent = userReceipts.reduce((sum, r) => sum + r.totalAmount, 0);
    
    // Receipt count achievements
    if (totalReceipts === 1) {
      achievements.badges.push({
        id: 'first_receipt',
        name: 'First Receipt',
        description: 'Uploaded your first receipt'
      });
    }
    
    if (totalReceipts === 10) {
      achievements.badges.push({
        id: 'receipt_collector',
        name: 'Receipt Collector',
        description: 'Uploaded 10 receipts'
      });
    }
    
    if (totalReceipts === 50) {
      achievements.badges.push({
        id: 'receipt_master',
        name: 'Receipt Master',
        description: 'Uploaded 50 receipts'
      });
    }
    
    // Spending achievements
    if (totalSpent >= 1000) {
      achievements.stars.push({
        id: 'big_spender',
        name: 'Big Spender',
        description: 'Spent over $1,000 total'
      });
    }
    
    // Health achievements
    if (receiptData.avgHealthScore >= 8) {
      achievements.badges.push({
        id: 'health_conscious',
        name: 'Health Conscious',
        description: 'Maintained high health score'
      });
    }
    
    // Store diversity achievements
    const uniqueStores = new Set(userReceipts.map(r => r.storeInfo?.name)).size;
    if (uniqueStores >= 10) {
      achievements.badges.push({
        id: 'store_explorer',
        name: 'Store Explorer',
        description: 'Shopped at 10 different stores'
      });
    }
    
    // Category achievements
    const categories = new Set();
    userReceipts.forEach(receipt => {
      if (receipt.storeInfo?.category) {
        categories.add(receipt.storeInfo.category);
      }
    });
    
    if (categories.size >= 5) {
      achievements.badges.push({
        id: 'category_master',
        name: 'Category Master',
        description: 'Shopped across 5 different categories'
      });
    }
    
    return achievements;
  }
  
  static getUserReceiptAnalytics(userId) {
    return ReceiptModel.getUserReceiptAnalytics(userId);
  }
  
  static getUserBidTokens(userId) {
    return BidTokenModel.getUserBidTokens(userId);
  }
  
  static getBidTokenAnalytics(userId) {
    return BidTokenModel.getBidTokenAnalytics(userId);
  }
  
  static spendBidTokens(userId, amount, purpose, metadata = {}) {
    return BidTokenModel.spendBidTokens(userId, amount, purpose, metadata);
  }
  
  static getReceiptInsights(userId) {
    const analytics = this.getUserReceiptAnalytics(userId);
    const bidTokenAnalytics = this.getBidTokenAnalytics(userId);
    
    return {
      summary: {
        totalReceipts: analytics.totalReceipts,
        totalSpent: analytics.totalSpent,
        avgReceiptAmount: analytics.avgReceiptAmount,
        totalBidTokens: analytics.totalBidTokens,
        currentBidTokenBalance: bidTokenAnalytics.balance
      },
      trends: {
        spendingTrend: analytics.spendingTrends,
        topCategories: analytics.topCategories,
        frequentStores: analytics.frequentStores
      },
      health: {
        avgHealthScore: analytics.avgHealthScore,
        healthyItems: analytics.healthyItems,
        healthTrend: this.calculateHealthTrend(userId)
      },
      recommendations: this.generatePersonalizedRecommendations(analytics, bidTokenAnalytics)
    };
  }
  
  static calculateHealthTrend(userId) {
    const userReceipts = ReceiptModel.getAllUserReceipts(userId);
    if (userReceipts.length < 3) {
      return { trend: 'insufficient_data', change: 0 };
    }
    
    const recent = userReceipts.slice(0, Math.floor(userReceipts.length / 2));
    const older = userReceipts.slice(Math.floor(userReceipts.length / 2));
    
    const recentAvg = recent.reduce((sum, r) => sum + (r.avgHealthScore || 5), 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + (r.avgHealthScore || 5), 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    let trend = 'stable';
    if (change > 5) trend = 'improving';
    else if (change < -5) trend = 'declining';
    
    return { trend, change: Math.round(change) };
  }
  
  static generatePersonalizedRecommendations(analytics, bidTokenAnalytics) {
    const recommendations = [];
    
    // Spending recommendations
    if (analytics.avgReceiptAmount < 25) {
      recommendations.push({
        type: 'spending',
        title: 'Bulk Shopping Bonus',
        message: 'Try combining purchases to reach $50+ for spending tier bonuses!',
        potential: 'Earn up to 25 bonus points per receipt'
      });
    }
    
    // Health recommendations
    if (analytics.avgHealthScore < 6) {
      recommendations.push({
        type: 'health',
        title: 'Healthy Shopping Rewards',
        message: 'Add more fruits and vegetables to boost your health score and earn bonus points!',
        potential: 'Up to 20% bonus points for healthy purchases'
      });
    }
    
    // Store recommendations
    const partnerStores = ['walmart', 'target', 'safeway', 'best buy', 'cvs'];
    const userStores = analytics.frequentStores.map(([store]) => store.toLowerCase());
    const missingPartners = partnerStores.filter(partner => 
      !userStores.some(store => store.toLowerCase().includes(partner))
    );
    
    if (missingPartners.length > 0) {
      recommendations.push({
        type: 'partnership',
        title: 'Partner Store Bonuses',
        message: `Shop at ${missingPartners[0]} to earn partnership bonuses!`,
        potential: 'Up to 30% bonus points and extra bid tokens'
      });
    }
    
    // Bid token recommendations
    if (bidTokenAnalytics.balance > 100) {
      recommendations.push({
        type: 'bidding',
        title: 'Use Your Bid Tokens',
        message: `You have ${bidTokenAnalytics.balance} bid tokens! Use them in auctions to win exclusive items.`,
        potential: 'Win valuable rewards in live auctions'
      });
    }
    
    return recommendations;
  }
}