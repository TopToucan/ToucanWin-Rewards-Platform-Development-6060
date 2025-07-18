import { BadgeModel } from '../models/BadgeModel';
import { UserController } from './UserController';

export class BadgeController {
  static getBadges() {
    return BadgeModel.getBadges();
  }

  static getUserBadges(userId) {
    return BadgeModel.getUserBadges(userId);
  }

  static getEarnedBadges(userId) {
    return BadgeModel.getEarnedBadges(userId);
  }

  static getUnearnedBadges(userId) {
    return BadgeModel.getUnearnedBadges(userId);
  }

  static getBadgeById(badgeId) {
    return BadgeModel.getBadgeById(badgeId);
  }

  static getBadgesByCategory(category) {
    return BadgeModel.getBadgesByCategory(category);
  }

  static awardBadge(userId, badgeId) {
    // In a real app, this would update the database
    console.log(`Awarding badge ${badgeId} to user ${userId}`);
    
    // Get the badge to determine if it should award points
    const badge = this.getBadgeById(badgeId);
    if (!badge) {
      return { success: false, message: "Badge not found" };
    }
    
    if (badge.earned) {
      return { success: false, message: "Badge already earned" };
    }
    
    // Award points for earning the badge (optional)
    const pointsToAward = 50; // Example: each badge gives 50 points
    const pointsResult = UserController.addPoints(
      userId,
      pointsToAward,
      `Badge: ${badge.name}`
    );
    
    return {
      success: true,
      message: `Awarded badge: ${badge.name}`,
      pointsEarned: pointsToAward,
      levelUp: pointsResult.levelUp,
      newLevel: pointsResult.newLevel,
      previousLevel: pointsResult.previousLevel
    };
  }

  static checkForBadgeAwards(userId, action, data = {}) {
    // Logic to check if any badges should be awarded based on user actions
    console.log(`Checking badge awards for user ${userId} based on action: ${action}`);
    console.log('Data:', data);
    
    // Example implementation
    let awardedBadges = [];
    
    switch (action) {
      case 'complete_mission':
        // Check for "First Steps" badge
        if (data.missionsCompleted === 1) {
          const result = this.awardBadge(userId, 8);
          if (result.success) {
            awardedBadges.push({
              badgeId: 8,
              name: "First Steps",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'upload_receipt':
        // Check for "Receipt Pro" badge
        if (data.receiptsUploaded >= 20) {
          const result = this.awardBadge(userId, 3);
          if (result.success) {
            awardedBadges.push({
              badgeId: 3,
              name: "Receipt Pro",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'win_auction':
        // Check for "Auction Master" badge
        if (data.auctionsWon >= 3) {
          const result = this.awardBadge(userId, 2);
          if (result.success) {
            awardedBadges.push({
              badgeId: 2,
              name: "Auction Master",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'fund_campaign':
        // Check for "Top Supporter" badge
        if (data.campaignsFunded >= 5) {
          const result = this.awardBadge(userId, 1);
          if (result.success) {
            awardedBadges.push({
              badgeId: 1,
              name: "Top Supporter",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'refer_friend':
        // Check for "Social Influencer" badge
        if (data.friendsReferred >= 5) {
          const result = this.awardBadge(userId, 4);
          if (result.success) {
            awardedBadges.push({
              badgeId: 4,
              name: "Social Influencer",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'level_up':
        // Check for "Platinum Tier" badge
        if (data.newLevel >= 8) {
          const result = this.awardBadge(userId, 5);
          if (result.success) {
            awardedBadges.push({
              badgeId: 5,
              name: "Platinum Tier",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'earn_points':
        // Check for "Point Collector" badge
        if (data.totalPoints >= 10000) {
          const result = this.awardBadge(userId, 6);
          if (result.success) {
            awardedBadges.push({
              badgeId: 6,
              name: "Point Collector",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'login_streak':
        // Check for "Perfect Streak" badge
        if (data.consecutiveDays >= 30) {
          const result = this.awardBadge(userId, 9);
          if (result.success) {
            awardedBadges.push({
              badgeId: 9,
              name: "Perfect Streak",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      case 'account_age':
        // Check for "Loyalty Champion" badge
        if (data.activeDays >= 365) {
          const result = this.awardBadge(userId, 7);
          if (result.success) {
            awardedBadges.push({
              badgeId: 7,
              name: "Loyalty Champion",
              pointsEarned: result.pointsEarned
            });
          }
        }
        break;
        
      default:
        break;
    }
    
    // Check if all other badges are earned for the ToucanWin Legend badge
    if (awardedBadges.length > 0) {
      const earnedBadges = this.getEarnedBadges(userId);
      if (earnedBadges.length === 9) { // All badges except ToucanWin Legend
        const result = this.awardBadge(userId, 10);
        if (result.success) {
          awardedBadges.push({
            badgeId: 10,
            name: "ToucanWin Legend",
            pointsEarned: result.pointsEarned
          });
        }
      }
    }
    
    return { success: true, awardedBadges };
  }
}