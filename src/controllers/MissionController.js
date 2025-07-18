import { MissionModel } from '../models/MissionModel';
import { UserController } from './UserController';

export class MissionController {
  static getMissions() {
    return MissionModel.getMissions();
  }
  
  static getMissionsByCategory(category) {
    const missions = MissionModel.getMissions();
    return category ? missions.filter(mission => mission.category === category) : missions;
  }
  
  static getBeginnerMissions() {
    return this.getMissionsByCategory('beginner');
  }
  
  static getWeeklyMissions() {
    return this.getMissionsByCategory('weekly');
  }
  
  static updateMissionProgress(missionId, progress) {
    const result = MissionModel.updateMissionProgress(missionId, progress);
    
    if (result.success && result.completed) {
      // In a real app, this would update the user's points in the database
      console.log(`Mission ${missionId} completed! User earned ${result.points} points.`);
      
      return {
        success: true,
        completed: true,
        pointsEarned: result.points,
        message: `Mission completed! You earned ${result.points} points.`
      };
    }
    
    return {
      success: result.success,
      completed: result.completed || false,
      pointsEarned: 0,
      message: result.success ? 'Progress updated successfully.' : 'Failed to update progress.'
    };
  }
  
  static completeMission(missionId) {
    const mission = MissionModel.getMissionById(missionId);
    
    if (mission && !mission.completed) {
      return this.updateMissionProgress(missionId, mission.target);
    }
    
    return {
      success: false,
      completed: false,
      pointsEarned: 0,
      message: 'Mission not found or already completed.'
    };
  }
  
  static resetWeeklyMissions() {
    return MissionModel.resetWeeklyMissions();
  }
  
  static getMissionsSummary() {
    const missions = MissionModel.getMissions();
    const total = missions.length;
    const completed = missions.filter(mission => mission.completed).length;
    const totalPoints = missions.reduce((sum, mission) => sum + mission.points, 0);
    const earnedPoints = missions
      .filter(mission => mission.completed)
      .reduce((sum, mission) => sum + mission.points, 0);
    
    return {
      total,
      completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalPoints,
      earnedPoints
    };
  }
}