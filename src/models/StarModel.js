export class StarModel {
  static getStars() {
    // In a real app, this would fetch from a database
    return [
      {
        id: 1,
        name: "First Steps",
        description: "Earned by completing your first mission",
        category: "missions",
        icon: "star",
        color: "teal.400",
        earned: true,
        earnedDate: "2024-03-15",
        pointsValue: 50
      },
      {
        id: 2,
        name: "Receipt Master",
        description: "Upload 10 receipts",
        category: "receipts",
        icon: "star",
        color: "teal.500",
        earned: true,
        earnedDate: "2024-03-18",
        pointsValue: 100
      },
      {
        id: 3,
        name: "Auction Victor",
        description: "Win your first auction",
        category: "auctions",
        icon: "star",
        color: "yellow.400",
        earned: true,
        earnedDate: "2024-03-20",
        pointsValue: 150
      },
      {
        id: 4,
        name: "Campaign Champion",
        description: "Complete 5 campaigns",
        category: "campaigns",
        icon: "star",
        color: "purple.400",
        earned: false,
        earnedDate: null,
        pointsValue: 200
      },
      {
        id: 5,
        name: "Social Butterfly",
        description: "Refer 3 friends who join",
        category: "social",
        icon: "star",
        color: "blue.400",
        earned: false,
        earnedDate: null,
        pointsValue: 250
      },
      {
        id: 6,
        name: "Loyal Member",
        description: "Member for 3 months",
        category: "loyalty",
        icon: "star",
        color: "green.400",
        earned: false,
        earnedDate: null,
        pointsValue: 300
      },
      {
        id: 7,
        name: "Shopping Spree",
        description: "Spend 5000 points on rewards",
        category: "rewards",
        icon: "star",
        color: "red.400",
        earned: false,
        earnedDate: null,
        pointsValue: 350
      },
      {
        id: 8,
        name: "Perfect Streak",
        description: "Complete daily missions for 7 days in a row",
        category: "missions",
        icon: "star",
        color: "orange.400",
        earned: false,
        earnedDate: null,
        pointsValue: 400
      },
      {
        id: 9,
        name: "Big Spender",
        description: "Upload receipts totaling over $1000",
        category: "receipts",
        icon: "star",
        color: "cyan.400",
        earned: false,
        earnedDate: null,
        pointsValue: 450
      },
      {
        id: 10,
        name: "Toucan Legend",
        description: "Earn all other stars",
        category: "special",
        icon: "star",
        color: "gold",
        earned: false,
        earnedDate: null,
        pointsValue: 1000
      }
    ];
  }

  static getUserStars(userId) {
    // In a real app, this would filter stars for a specific user
    return this.getStars();
  }

  static getEarnedStars(userId) {
    return this.getUserStars(userId).filter(star => star.earned);
  }

  static getUnearnedStars(userId) {
    return this.getUserStars(userId).filter(star => !star.earned);
  }

  static getStarById(starId) {
    return this.getStars().find(star => star.id === starId);
  }

  static getStarsByCategory(category) {
    return this.getStars().filter(star => star.category === category);
  }

  static getTotalStarsValue() {
    return this.getStars().reduce((total, star) => total + star.pointsValue, 0);
  }

  static getEarnedStarsValue(userId) {
    return this.getEarnedStars(userId).reduce((total, star) => total + star.pointsValue, 0);
  }
}