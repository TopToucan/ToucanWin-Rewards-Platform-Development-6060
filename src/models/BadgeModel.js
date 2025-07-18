export class BadgeModel {
  static getBadges() {
    return [
      {
        id: 1,
        name: "Top Supporter",
        description: "Fund 5 or more campaigns",
        image: "https://images.unsplash.com/photo-1611937667524-55c1642f9f43?auto=format&fit=crop&q=80&w=200",
        category: "campaign",
        criteria: "fund_campaigns:5",
        earned: true,
        earnedDate: "2024-03-15"
      },
      {
        id: 2,
        name: "Auction Master",
        description: "Win 3 auctions",
        image: "https://images.unsplash.com/photo-1531956759688-e71cc2586e34?auto=format&fit=crop&q=80&w=200",
        category: "auction",
        criteria: "win_auctions:3",
        earned: true,
        earnedDate: "2024-03-22"
      },
      {
        id: 3,
        name: "Receipt Pro",
        description: "Upload 20 receipts",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=200",
        category: "receipts",
        criteria: "upload_receipts:20",
        earned: true,
        earnedDate: "2024-04-01"
      },
      {
        id: 4,
        name: "Social Influencer",
        description: "Refer 5 friends who join",
        image: "https://images.unsplash.com/photo-1568739253582-afa48fbcea47?auto=format&fit=crop&q=80&w=200",
        category: "social",
        criteria: "refer_friends:5",
        earned: false
      },
      {
        id: 5,
        name: "Platinum Tier",
        description: "Reach Level 8",
        image: "https://images.unsplash.com/photo-1640952131659-49a06dd90ad2?auto=format&fit=crop&q=80&w=200",
        category: "level",
        criteria: "reach_level:8",
        earned: false
      },
      {
        id: 6,
        name: "Point Collector",
        description: "Earn 10,000 points",
        image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&q=80&w=200",
        category: "points",
        criteria: "earn_points:10000",
        earned: false
      },
      {
        id: 7,
        name: "Loyalty Champion",
        description: "Active member for 1 year",
        image: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?auto=format&fit=crop&q=80&w=200",
        category: "loyalty",
        criteria: "active_days:365",
        earned: false
      },
      {
        id: 8,
        name: "First Steps",
        description: "Complete your first mission",
        image: "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?auto=format&fit=crop&q=80&w=200",
        category: "missions",
        criteria: "complete_missions:1",
        earned: true,
        earnedDate: "2024-02-10"
      },
      {
        id: 9,
        name: "Perfect Streak",
        description: "Log in for 30 consecutive days",
        image: "https://images.unsplash.com/photo-1608559347521-4d61a8d5a0e6?auto=format&fit=crop&q=80&w=200",
        category: "loyalty",
        criteria: "login_streak:30",
        earned: false
      },
      {
        id: 10,
        name: "ToucanWin Legend",
        description: "Earn all other badges",
        image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&q=80&w=200",
        category: "special",
        criteria: "earn_all_badges",
        earned: false
      }
    ];
  }

  static getUserBadges(userId) {
    // In a real app, this would filter badges for a specific user
    return this.getBadges();
  }

  static getEarnedBadges(userId) {
    return this.getUserBadges(userId).filter(badge => badge.earned);
  }

  static getUnearnedBadges(userId) {
    return this.getUserBadges(userId).filter(badge => !badge.earned);
  }

  static getBadgeById(badgeId) {
    return this.getBadges().find(badge => badge.id === badgeId);
  }

  static getBadgesByCategory(category) {
    return this.getBadges().filter(badge => badge.category === category);
  }
}