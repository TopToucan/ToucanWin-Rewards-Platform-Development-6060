import { StarModel } from '../models/StarModel';
import { UserController } from './UserController';

export class StarController {
  static getStars() {
    return StarModel.getStars();
  }

  static getUserStars(userId) {
    return StarModel.getUserStars(userId);
  }

  static getEarnedStars(userId) {
    return StarModel.getEarnedStars(userId);
  }

  static getUnearnedStars(userId) {
    return StarModel.getUnearnedStars(userId);
  }

  static getStarById(starId) {
    return StarModel.getStarById(starId);
  }

  static getStarsByCategory(category) {
    return StarModel.getStarsByCategory(category);
  }

  static getTotalStarsValue() {
    return StarModel.getTotalStarsValue();
  }

  static getEarnedStarsValue(userId) {
    return StarModel.getEarnedStarsValue(userId);
  }

  static awardStar(userId, starId) {
    // In a real app, this would update the database
    console.log(`Awarding star ${starId} to user ${userId}`);
    
    // Get the star to determine its point value
    const star = this.getStarById(starId);
    
    if (!star) {
      return {
        success: false,
        message: "Star not found"
      };
    }
    
    if (star.earned) {
      return {
        success: false,
        message: "Star already earned"
      };
    }
    
    // Award the points associated with the star
    const pointsResult = UserController.addPoints(
      userId, 
      star.pointsValue, 
      `Star: ${star.name}`
    );
    
    // Check for level up
    return {
      success: true,
      message: `Awarded star: ${star.name}`,
      pointsEarned: star.pointsValue,
      levelUp: pointsResult.levelUp,
      newLevel: pointsResult.newLevel,
      previousLevel: pointsResult.previousLevel
    };
  }

  static checkForStarAwards(userId, action, data = {}) {
    // Logic to check if any stars should be awarded based on user actions
    // This would check conditions for each star and award as appropriate
    
    console.log(`Checking star awards for user ${userId} based on action: ${action}`);
    console.log('Data:', data);
    
    // Example implementation (simplified)
    let awardedStars = [];
    
    switch (action) {
      case 'complete_mission':
        // Check if this is their first mission (for "First Steps" star)
        if (data.missionsCompleted === 1) {
          const result = this.awardStar(userId, 1); // First Steps star
          if (result.success) {
            awardedStars.push({
              starId: 1,
              name: "First Steps",
              pointsEarned: 50
            });
          }
        }
        
        // Check for Perfect Streak star
        if (data.consecutiveDays >= 7) {
          const result = this.awardStar(userId, 8); // Perfect Streak star
          if (result.success) {
            awardedStars.push({
              starId: 8,
              name: "Perfect Streak",
              pointsEarned: 400
            });
          }
        }
        break;
        
      case 'upload_receipt':
        // Check for Receipt Master star
        if (data.receiptsUploaded >= 10) {
          const result = this.awardStar(userId, 2); // Receipt Master star
          if (result.success) {
            awardedStars.push({
              starId: 2,
              name: "Receipt Master",
              pointsEarned: 100
            });
          }
        }
        
        // Check for Big Spender star
        if (data.totalReceiptAmount >= 1000) {
          const result = this.awardStar(userId, 9); // Big Spender star
          if (result.success) {
            awardedStars.push({
              starId: 9,
              name: "Big Spender",
              pointsEarned: 450
            });
          }
        }
        break;
        
      case 'win_auction':
        // Check for Auction Victor star
        if (data.auctionsWon === 1) {
          const result = this.awardStar(userId, 3); // Auction Victor star
          if (result.success) {
            awardedStars.push({
              starId: 3,
              name: "Auction Victor",
              pointsEarned: 150
            });
          }
        }
        break;
        
      case 'complete_campaign':
        // Check for Campaign Champion star
        if (data.campaignsCompleted >= 5) {
          const result = this.awardStar(userId, 4); // Campaign Champion star
          if (result.success) {
            awardedStars.push({
              starId: 4,
              name: "Campaign Champion",
              pointsEarned: 200
            });
          }
        }
        break;
        
      case 'refer_friend':
        // Check for Social Butterfly star
        if (data.friendsReferred >= 3) {
          const result = this.awardStar(userId, 5); // Social Butterfly star
          if (result.success) {
            awardedStars.push({
              starId: 5,
              name: "Social Butterfly",
              pointsEarned: 250
            });
          }
        }
        break;
        
      case 'membership_duration':
        // Check for Loyal Member star
        if (data.monthsActive >= 3) {
          const result = this.awardStar(userId, 6); // Loyal Member star
          if (result.success) {
            awardedStars.push({
              starId: 6,
              name: "Loyal Member",
              pointsEarned: 300
            });
          }
        }
        break;
        
      case 'spend_points':
        // Check for Shopping Spree star
        if (data.pointsSpent >= 5000) {
          const result = this.awardStar(userId, 7); // Shopping Spree star
          if (result.success) {
            awardedStars.push({
              starId: 7,
              name: "Shopping Spree",
              pointsEarned: 350
            });
          }
        }
        break;
        
      default:
        break;
    }
    
    // Check if all other stars are earned for the Toucan Legend star
    if (awardedStars.length > 0) {
      const earnedStars = this.getEarnedStars(userId);
      if (earnedStars.length === 9) { // All stars except Toucan Legend
        const result = this.awardStar(userId, 10); // Toucan Legend star
        if (result.success) {
          awardedStars.push({
            starId: 10,
            name: "Toucan Legend",
            pointsEarned: 1000
          });
        }
      }
    }
    
    return {
      success: true,
      awardedStars
    };
  }
}