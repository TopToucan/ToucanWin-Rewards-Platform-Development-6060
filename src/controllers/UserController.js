import { UserModel } from '../models/UserModel';
import { StarController } from './StarController';
import { BadgeController } from './BadgeController';

export class UserController {
  static getUser() {
    return UserModel.getUser();
  }

  static getUserLevel(userId) {
    const user = UserModel.getUser();
    return {
      level: user.level,
      title: user.title,
      pointsToNextLevel: user.pointsToNextLevel,
      totalPointsForCurrentLevel: user.totalPointsForCurrentLevel,
      totalPointsForNextLevel: user.totalPointsForNextLevel
    };
  }

  static getLevelBenefits(level) {
    return UserModel.getLevelBenefits(level);
  }

  static getAllLevelBenefits() {
    return UserModel.getAllLevelBenefits();
  }

  static handleReceiptUpload(file) {
    console.log('Receipt uploaded:', file);
    const result = UserModel.processReceipt(file);
    
    if (result.success) {
      // Record participation
      const participationResult = this.recordParticipation(1, 'receipt_upload');
      
      // Update user points for the receipt
      const user = UserModel.getUser();
      const updateResult = UserModel.updateUserPoints(user.id, result.pointsEarned);
      
      console.log(`Receipt processed successfully. ${result.pointsEarned} points earned.`);
      
      // Check for additional points from receipt upload milestones
      let milestoneBonusPoints = 0;
      let earnedMilestones = [];
      
      if (result.receiptTracking.isNewMilestone) {
        const milestones = UserModel.getReceiptMilestones();
        const rewardsEarned = result.receiptTracking.rewardsEarned;
        
        // Calculate milestone bonus points
        rewardsEarned.forEach(rewardId => {
          // Check daily milestones
          const dailyMilestone = milestones.daily.find(m => m.id === rewardId);
          if (dailyMilestone) {
            milestoneBonusPoints += dailyMilestone.points;
            earnedMilestones.push(dailyMilestone);
          }
          
          // Check total milestones
          const totalMilestone = milestones.total.find(m => m.id === rewardId);
          if (totalMilestone) {
            milestoneBonusPoints += totalMilestone.points;
            earnedMilestones.push(totalMilestone);
          }
        });
        
        // Add milestone bonus points
        if (milestoneBonusPoints > 0) {
          const bonusResult = UserModel.updateUserPoints(user.id, milestoneBonusPoints);
          console.log(`Receipt milestone bonus: ${milestoneBonusPoints} points`);
        }
      }
      
      // Check for star awards based on receipt upload
      const starResult = StarController.checkForStarAwards(
        user.id,
        'upload_receipt',
        {
          receiptsUploaded: result.receiptTracking.totalUploads,
          dailyReceiptsUploaded: result.receiptTracking.dailyUploads,
          totalReceiptAmount: 500 // Simulated amount
        }
      );
      
      // Check for badge awards
      const badgeResult = BadgeController.checkForBadgeAwards(
        user.id,
        'upload_receipt',
        {
          receiptsUploaded: result.receiptTracking.totalUploads
        }
      );
      
      // Return all information
      return {
        ...result,
        levelUp: updateResult.levelUp,
        newLevel: updateResult.newLevel,
        previousLevel: updateResult.previousLevel,
        starsAwarded: starResult.awardedStars,
        badgesAwarded: badgeResult.awardedBadges,
        participationUpdate: participationResult,
        milestoneBonusPoints,
        earnedMilestones
      };
    }
    
    return result;
  }
  
  static getReceiptUploadStats() {
    return UserModel.getReceiptUploadStats();
  }
  
  static getReceiptMilestones() {
    return UserModel.getReceiptMilestones();
  }

  static updateProfile(userId, profileData) {
    // Mock implementation
    console.log(`Updating profile for user ${userId}:`, profileData);
    return true;
  }

  static addPoints(userId, points, source) {
    // Add points and check for level up
    console.log(`Adding ${points} points to user ${userId} from source: ${source}`);
    const updateResult = UserModel.updateUserPoints(userId, points);
    
    return {
      success: true,
      pointsAdded: points,
      levelUp: updateResult.levelUp,
      newLevel: updateResult.newLevel,
      previousLevel: updateResult.previousLevel,
      source
    };
  }

  static deductPoints(userId, points, reason) {
    // Deduct points for rewards redemption, etc.
    console.log(`Deducting ${points} points from user ${userId} for: ${reason}`);
    
    // In a real app, we'd update the database here
    return {
      success: true,
      pointsDeducted: points,
      reason
    };
  }
  
  static getDailyBonusStatus() {
    return UserModel.getDailyBonusStatus();
  }
  
  static claimDailyBonus(userId) {
    const claimResult = UserModel.claimDailyBonus(userId);
    
    if (claimResult.success) {
      // Record participation for daily bonus
      this.recordParticipation(userId, 'daily_bonus');
      
      // Add the points to user's account
      const pointsResult = this.addPoints(
        userId, 
        claimResult.points, 
        "Daily Bonus"
      );
      
      // Check if this is a streak milestone
      if (claimResult.streakMilestone) {
        // Could trigger special rewards, badges, etc. for milestone streaks
        console.log(`User ${userId} reached streak milestone: ${claimResult.streak} days!`);
      }
      
      return {
        ...claimResult,
        levelUp: pointsResult.levelUp,
        newLevel: pointsResult.newLevel,
        previousLevel: pointsResult.previousLevel
      };
    }
    
    return claimResult;
  }

  // Participation streak methods
  static getParticipationStreakData() {
    return UserModel.getParticipationStreakData();
  }

  static getParticipationMilestones() {
    return UserModel.getParticipationMilestones();
  }

  static recordParticipation(userId, activityType) {
    const participationResult = UserModel.recordParticipation(userId, activityType);
    
    if (participationResult.success && participationResult.streakContinued) {
      // Check for milestone achievements
      const milestoneResult = UserModel.checkParticipationMilestones(userId);
      
      if (milestoneResult.success && milestoneResult.newMilestones.length > 0) {
        // Award points for milestones
        this.addPoints(userId, milestoneResult.totalPointsEarned, "Participation Milestone");
        
        return {
          ...participationResult,
          milestoneAchieved: true,
          newMilestones: milestoneResult.newMilestones,
          milestonePoints: milestoneResult.totalPointsEarned
        };
      }
    }
    
    return {
      ...participationResult,
      milestoneAchieved: false,
      newMilestones: [],
      milestonePoints: 0
    };
  }

  static joinCampaign(userId, campaignId) {
    // Record participation for joining campaign
    const participationResult = this.recordParticipation(userId, 'campaign_join');
    
    console.log(`User ${userId} joined campaign ${campaignId}`);
    
    return {
      success: true,
      participationUpdate: participationResult
    };
  }

  static placeBid(userId, auctionId, bidAmount) {
    // Record participation for auction bidding
    const participationResult = this.recordParticipation(userId, 'auction_bid');
    
    console.log(`User ${userId} placed bid on auction ${auctionId}`);
    
    return {
      success: true,
      participationUpdate: participationResult
    };
  }
}