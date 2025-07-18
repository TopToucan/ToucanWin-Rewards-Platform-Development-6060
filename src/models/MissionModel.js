export class MissionModel {
  static getMissions() {
    return [
      {
        id: 1,
        title: "Join Your First Campaign",
        description: "Sign up for any active campaign to earn bonus points",
        points: 50,
        completed: false,
        icon: "FiFlag",
        progress: 0,
        target: 1,
        category: "beginner"
      },
      {
        id: 2,
        title: "Upload 3 Receipts",
        description: "Upload shopping receipts to earn points and complete this mission",
        points: 100,
        completed: false,
        icon: "FiUpload",
        progress: 0,
        target: 3,
        category: "regular"
      },
      {
        id: 3,
        title: "Place Your First Bid",
        description: "Participate in any auction by placing a bid",
        points: 75,
        completed: false,
        icon: "FiTrendingUp",
        progress: 0,
        target: 1,
        category: "beginner"
      },
      {
        id: 4,
        title: "Complete Your Profile",
        description: "Fill in all your profile details to unlock profile bonuses",
        points: 30,
        completed: false,
        icon: "FiUser",
        progress: 0,
        target: 1,
        category: "beginner"
      },
      {
        id: 5,
        title: "Refer a Friend",
        description: "Invite a friend to join ToucanWin Rewards",
        points: 150,
        completed: false,
        icon: "FiUserPlus",
        progress: 0,
        target: 1,
        category: "social"
      },
      {
        id: 6,
        title: "Weekly Shopping Spree",
        description: "Upload receipts from 5 different stores this week",
        points: 200,
        completed: false,
        icon: "FiShoppingBag",
        progress: 0,
        target: 5,
        category: "weekly"
      }
    ];
  }

  static getMissionById(id) {
    const missions = this.getMissions();
    return missions.find(mission => mission.id === id);
  }

  static updateMissionProgress(id, progress) {
    // In a real app, this would update a database
    // For demo purposes, we'll simulate the update
    const missions = this.getMissions();
    const missionIndex = missions.findIndex(mission => mission.id === id);
    
    if (missionIndex !== -1) {
      const mission = missions[missionIndex];
      const updatedProgress = Math.min(progress, mission.target);
      
      if (updatedProgress >= mission.target && !mission.completed) {
        return {
          success: true,
          completed: true,
          points: mission.points
        };
      }
      
      return {
        success: true,
        completed: mission.completed,
        points: 0
      };
    }
    
    return { success: false };
  }

  static resetWeeklyMissions() {
    // In a real app, this would reset weekly missions in the database
    return { success: true };
  }
}