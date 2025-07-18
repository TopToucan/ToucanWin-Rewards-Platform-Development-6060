export class UserModel {
  static getUser() {
    return {
      id: 1,
      name: "John Doe",
      points: 1000,
      campaignsJoined: 3,
      auctionsWon: 1,
      memberSince: "2024",
      // Level progression data
      level: 3,
      title: "Reward Pro",
      pointsToNextLevel: 500,
      totalPointsForCurrentLevel: 1000,
      totalPointsForNextLevel: 1500,
      // Daily bonus tracking
      dailyBonus: {
        lastClaim: "2024-04-15", // Will be compared with current date
        streak: 3,
        claimed: false
      },
      // Participation streak tracking
      participationStreak: {
        currentStreak: 5,
        longestStreak: 8,
        lastParticipationDate: "2024-04-15",
        milestonesAchieved: [3], // Track which milestones have been achieved
        streakHistory: [
          { date: "2024-04-15", activities: ["login", "daily_bonus"] },
          { date: "2024-04-14", activities: ["login", "campaign_join"] },
          { date: "2024-04-13", activities: ["login", "receipt_upload"] },
          { date: "2024-04-12", activities: ["login", "auction_bid"] },
          { date: "2024-04-11", activities: ["login", "daily_bonus"] }
        ]
      },
      // Receipt uploads tracking
      receiptUploads: {
        totalUploads: 8,
        dailyUploads: [
          { date: "2024-04-15", uploads: 2, rewardsEarned: ["daily_5"] },
          { date: "2024-04-14", uploads: 3, rewardsEarned: [] },
          { date: "2024-04-13", uploads: 1, rewardsEarned: [] },
          { date: "2024-04-12", uploads: 2, rewardsEarned: [] }
        ],
        milestones: {
          daily_5: { achieved: true, date: "2024-04-15" },
          daily_10: { achieved: false, date: null },
          total_10: { achieved: false, date: null },
          total_25: { achieved: false, date: null },
          total_50: { achieved: false, date: null },
          total_100: { achieved: false, date: null }
        }
      }
    };
  }

  static updateUserPoints(userId, points) {
    // Mock implementation - in real app, this would update the database
    console.log(`Updating user ${userId} with ${points} points`);
    
    // Check for level up opportunity
    const user = this.getUser();
    const newPoints = user.points + points;
    const levelData = this.calculateLevel(newPoints);
    
    if (levelData.level > user.level) {
      console.log(`User ${userId} leveled up to level ${levelData.level}!`);
      return {
        success: true,
        levelUp: true,
        newLevel: levelData.level,
        previousLevel: user.level
      };
    }
    
    return {
      success: true,
      levelUp: false
    };
  }

  static processReceipt(file) {
    // Mock receipt processing - in real app, this would use OCR/AI
    console.log(`Processing receipt: ${file.name}`);
    
    // Track receipt upload
    const receiptTrackingResult = this.trackReceiptUpload();
    
    return {
      success: true,
      pointsEarned: Math.floor(Math.random() * 100) + 50,
      items: ["Item 1", "Item 2", "Item 3"],
      receiptTracking: receiptTrackingResult
    };
  }

  static trackReceiptUpload() {
    const user = this.getUser();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Update total uploads count
    user.receiptUploads.totalUploads += 1;
    const totalUploads = user.receiptUploads.totalUploads;
    
    // Check for daily upload entry for today
    let todayEntry = user.receiptUploads.dailyUploads.find(entry => entry.date === today);
    let isNewMilestone = false;
    let rewardsEarned = [];
    
    if (todayEntry) {
      // Update existing entry
      todayEntry.uploads += 1;
    } else {
      // Create new entry for today
      todayEntry = { date: today, uploads: 1, rewardsEarned: [] };
      user.receiptUploads.dailyUploads.unshift(todayEntry);
      
      // Keep only last 30 days
      if (user.receiptUploads.dailyUploads.length > 30) {
        user.receiptUploads.dailyUploads.pop();
      }
    }
    
    // Check for daily upload milestones
    if (todayEntry.uploads === 5 && !todayEntry.rewardsEarned.includes('daily_5')) {
      isNewMilestone = true;
      rewardsEarned.push('daily_5');
      todayEntry.rewardsEarned.push('daily_5');
      user.receiptUploads.milestones.daily_5 = { achieved: true, date: today };
    }
    
    if (todayEntry.uploads === 10 && !todayEntry.rewardsEarned.includes('daily_10')) {
      isNewMilestone = true;
      rewardsEarned.push('daily_10');
      todayEntry.rewardsEarned.push('daily_10');
      user.receiptUploads.milestones.daily_10 = { achieved: true, date: today };
    }
    
    // Check for total upload milestones
    const totalMilestones = [
      { id: 'total_10', threshold: 10 },
      { id: 'total_25', threshold: 25 },
      { id: 'total_50', threshold: 50 },
      { id: 'total_100', threshold: 100 }
    ];
    
    for (const milestone of totalMilestones) {
      if (totalUploads >= milestone.threshold && !user.receiptUploads.milestones[milestone.id].achieved) {
        isNewMilestone = true;
        rewardsEarned.push(milestone.id);
        user.receiptUploads.milestones[milestone.id] = { achieved: true, date: today };
      }
    }
    
    return {
      dailyUploads: todayEntry.uploads,
      totalUploads,
      isNewMilestone,
      rewardsEarned
    };
  }

  static getReceiptUploadStats() {
    const user = this.getUser();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get today's uploads
    const todayEntry = user.receiptUploads.dailyUploads.find(entry => entry.date === today);
    const dailyUploads = todayEntry ? todayEntry.uploads : 0;
    
    // Get milestones status
    const milestones = user.receiptUploads.milestones;
    
    return {
      dailyUploads,
      totalUploads: user.receiptUploads.totalUploads,
      milestones,
      recentActivity: user.receiptUploads.dailyUploads.slice(0, 7) // Last 7 days
    };
  }

  static getReceiptMilestones() {
    return {
      daily: [
        { id: 'daily_5', name: '5 Daily Uploads', points: 50, threshold: 5, description: 'Upload 5 receipts in a single day' },
        { id: 'daily_10', name: '10 Daily Uploads', points: 100, threshold: 10, description: 'Upload 10 receipts in a single day' }
      ],
      total: [
        { id: 'total_10', name: '10 Total Uploads', points: 100, threshold: 10, description: 'Upload a total of 10 receipts' },
        { id: 'total_25', name: '25 Total Uploads', points: 250, threshold: 25, description: 'Upload a total of 25 receipts' },
        { id: 'total_50', name: '50 Total Uploads', points: 500, threshold: 50, description: 'Upload a total of 50 receipts' },
        { id: 'total_100', name: '100 Total Uploads', points: 1000, threshold: 100, description: 'Upload a total of 100 receipts' }
      ]
    };
  }

  static calculateLevel(points) {
    // Level thresholds - each level requires more points
    const thresholds = [
      0,     // Level 1: 0-499 points
      500,   // Level 2: 500-999 points
      1000,  // Level 3: 1000-1499 points
      1500,  // Level 4: 1500-2499 points
      2500,  // Level 5: 2500-3999 points
      4000,  // Level 6: 4000-5999 points
      6000,  // Level 7: 6000-8499 points
      8500,  // Level 8: 8500-11499 points
      11500, // Level 9: 11500-14999 points
      15000, // Level 10: 15000+ points
    ];
    
    // Find current level based on points
    let level = 1;
    for (let i = 0; i < thresholds.length; i++) {
      if (points >= thresholds[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    
    // Calculate points needed for next level
    const currentLevelThreshold = thresholds[level - 1] || 0;
    const nextLevelThreshold = thresholds[level] || thresholds[level - 1] + 1500;
    const pointsToNextLevel = nextLevelThreshold - points;
    
    return {
      level,
      title: this.getLevelTitle(level),
      pointsToNextLevel,
      totalPointsForCurrentLevel: currentLevelThreshold,
      totalPointsForNextLevel: nextLevelThreshold
    };
  }

  static getLevelTitle(level) {
    const titles = [
      "Newcomer",       // Level 1
      "Explorer",       // Level 2
      "Reward Pro",     // Level 3
      "Achievement Hunter", // Level 4
      "Point Master",   // Level 5
      "Elite Member",   // Level 6
      "Campaign Legend", // Level 7
      "Auction Champion", // Level 8
      "Reward Virtuoso", // Level 9
      "Toucan Legend"   // Level 10
    ];
    
    return titles[level - 1] || "Toucan Legend";
  }

  static getLevelBenefits(level) {
    return [
      // Each level gets all previous benefits plus new ones
      {
        level: 1,
        benefits: [
          { name: "Basic Rewards Access", description: "Access to standard rewards catalog" }
        ]
      },
      {
        level: 2,
        benefits: [
          { name: "5% Point Bonus", description: "Earn 5% more points on all activities" }
        ]
      },
      {
        level: 3,
        benefits: [
          { name: "Priority Support", description: "Get priority customer support" },
          { name: "Exclusive Rewards", description: "Access to level 3 exclusive rewards" }
        ]
      },
      {
        level: 4,
        benefits: [
          { name: "10% Point Bonus", description: "Earn 10% more points on all activities" },
          { name: "Early Access", description: "24-hour early access to new campaigns" }
        ]
      },
      {
        level: 5,
        benefits: [
          { name: "Referral Bonus", description: "2x points for referring friends" },
          { name: "Monthly Gift", description: "Free monthly reward" }
        ]
      },
      {
        level: 6,
        benefits: [
          { name: "15% Point Bonus", description: "Earn 15% more points on all activities" },
          { name: "VIP Events", description: "Invitation to exclusive VIP events" }
        ]
      },
      {
        level: 7,
        benefits: [
          { name: "Advanced Bidding", description: "Place bids with reduced fees" },
          { name: "Premium Catalog", description: "Access to premium rewards catalog" }
        ]
      },
      {
        level: 8,
        benefits: [
          { name: "20% Point Bonus", description: "Earn 20% more points on all activities" },
          { name: "Double Rewards", description: "Double rewards on special campaigns" }
        ]
      },
      {
        level: 9,
        benefits: [
          { name: "Personal Account Manager", description: "Dedicated account manager" },
          { name: "Custom Rewards", description: "Request custom reward options" }
        ]
      },
      {
        level: 10,
        benefits: [
          { name: "25% Point Bonus", description: "Earn 25% more points on all activities" },
          { name: "Lifetime Status", description: "Keep your status benefits permanently" },
          { name: "Executive Benefits", description: "Special executive benefits package" }
        ]
      }
    ].slice(0, level);
  }

  static getAllLevelBenefits() {
    const allLevels = [];
    for (let i = 1; i <= 10; i++) {
      allLevels.push({
        level: i,
        title: this.getLevelTitle(i),
        benefits: this.getLevelBenefits(i)[i - 1].benefits
      });
    }
    return allLevels;
  }

  // Daily bonus methods
  static getDailyBonusStatus() {
    const user = this.getUser();
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Check if bonus is available
    const isAvailable = user.dailyBonus.lastClaim !== today;
    
    return {
      streak: user.dailyBonus.streak,
      lastClaim: user.dailyBonus.lastClaim,
      isAvailable,
      nextBonusAmount: this.calculateDailyBonusAmount(user.dailyBonus.streak)
    };
  }
  
  static calculateDailyBonusAmount(streak) {
    // Base daily bonus is 10 points
    // Every 5 consecutive days, bonus increases
    const baseAmount = 10;
    const streakMultiplier = Math.floor(streak / 5) + 1;
    return baseAmount * streakMultiplier;
  }
  
  static claimDailyBonus(userId) {
    const user = this.getUser();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if already claimed today
    if (user.dailyBonus.lastClaim === today) {
      return {
        success: false,
        message: "Daily bonus already claimed today",
        points: 0
      };
    }
    
    // Check if streak continues or resets
    let newStreak = user.dailyBonus.streak;
    if (user.dailyBonus.lastClaim === yesterdayStr) {
      // Streak continues
      newStreak++;
    } else if (user.dailyBonus.lastClaim !== today) {
      // Streak resets if not consecutive
      newStreak = 1;
    }
    
    // Calculate bonus amount
    const bonusPoints = this.calculateDailyBonusAmount(newStreak);
    
    // In a real app, update user data in database
    console.log(`User ${userId} claimed daily bonus: ${bonusPoints} points, streak: ${newStreak}`);
    
    // Update mock user data
    user.dailyBonus = {
      lastClaim: today,
      streak: newStreak,
      claimed: true
    };
    
    return {
      success: true,
      message: `Daily bonus claimed! +${bonusPoints} points`,
      points: bonusPoints,
      streak: newStreak,
      streakMilestone: newStreak % 5 === 0 // Special milestone every 5 days
    };
  }

  // Participation streak methods
  static getParticipationStreakData() {
    const user = this.getUser();
    return user.participationStreak;
  }

  static getParticipationMilestones() {
    return [
      { days: 3, points: 50, title: "3-Day Streak", description: "Getting started!" },
      { days: 7, points: 100, title: "Weekly Warrior", description: "One week strong!" },
      { days: 14, points: 200, title: "Fortnight Fighter", description: "Two weeks of dedication!" },
      { days: 21, points: 350, title: "Triple Week Champion", description: "Three weeks of consistency!" },
      { days: 30, points: 500, title: "Monthly Master", description: "A full month of engagement!" },
      { days: 60, points: 1000, title: "Two-Month Titan", description: "Incredible dedication!" },
      { days: 90, points: 1500, title: "Quarterly Legend", description: "Three months of excellence!" },
      { days: 180, points: 3000, title: "Half-Year Hero", description: "Six months of commitment!" },
      { days: 365, points: 5000, title: "Annual Achiever", description: "A full year of participation!" }
    ];
  }

  static recordParticipation(userId, activityType) {
    const user = this.getUser();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if user already participated today
    const todayRecord = user.participationStreak.streakHistory.find(
      record => record.date === today
    );

    if (todayRecord) {
      // Add activity to today's record if not already present
      if (!todayRecord.activities.includes(activityType)) {
        todayRecord.activities.push(activityType);
      }
      return {
        success: true,
        streakContinued: false,
        currentStreak: user.participationStreak.currentStreak
      };
    }

    // Check if streak continues or resets
    let newStreak = user.participationStreak.currentStreak;
    if (user.participationStreak.lastParticipationDate === yesterdayStr) {
      // Streak continues
      newStreak++;
    } else if (user.participationStreak.lastParticipationDate !== today) {
      // Streak resets if not consecutive
      newStreak = 1;
    }

    // Update participation data
    user.participationStreak.currentStreak = newStreak;
    user.participationStreak.lastParticipationDate = today;
    user.participationStreak.longestStreak = Math.max(
      user.participationStreak.longestStreak,
      newStreak
    );

    // Add today's record
    user.participationStreak.streakHistory.unshift({
      date: today,
      activities: [activityType]
    });

    // Keep only last 30 days of history
    user.participationStreak.streakHistory = user.participationStreak.streakHistory.slice(0, 30);

    console.log(`User ${userId} participated today (${activityType}). Streak: ${newStreak}`);

    return {
      success: true,
      streakContinued: true,
      currentStreak: newStreak,
      previousStreak: user.participationStreak.currentStreak - 1
    };
  }

  static checkParticipationMilestones(userId) {
    const user = this.getUser();
    const milestones = this.getParticipationMilestones();
    const currentStreak = user.participationStreak.currentStreak;
    const achievedMilestones = user.participationStreak.milestonesAchieved;

    // Find new milestones reached
    const newMilestones = milestones.filter(milestone => 
      milestone.days <= currentStreak && 
      !achievedMilestones.includes(milestone.days)
    );

    if (newMilestones.length > 0) {
      // Update achieved milestones
      newMilestones.forEach(milestone => {
        achievedMilestones.push(milestone.days);
      });

      return {
        success: true,
        newMilestones,
        totalPointsEarned: newMilestones.reduce((sum, milestone) => sum + milestone.points, 0)
      };
    }

    return {
      success: false,
      newMilestones: [],
      totalPointsEarned: 0
    };
  }
}