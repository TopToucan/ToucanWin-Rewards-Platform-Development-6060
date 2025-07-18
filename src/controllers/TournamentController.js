import { TournamentModel } from '../models/TournamentModel';
import { UserController } from './UserController';

export class TournamentController {
  static getTournaments() {
    return TournamentModel.getTournaments();
  }

  static getTournamentById(id) {
    return TournamentModel.getTournamentById(id);
  }

  static getActiveTournaments() {
    return TournamentModel.getActiveTournaments();
  }

  static getUpcomingTournaments() {
    return TournamentModel.getUpcomingTournaments();
  }

  static joinTournament(tournamentId, userId) {
    const tournament = TournamentModel.getTournamentById(tournamentId);
    
    if (!tournament) {
      return { success: false, message: "Tournament not found" };
    }

    if (tournament.status !== 'active' && tournament.status !== 'upcoming') {
      return { success: false, message: "Tournament is not available for registration" };
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return { success: false, message: "Tournament is full" };
    }

    // Check if user has enough points for entry fee
    const user = UserController.getUser();
    if (user && tournament.entryFee > 0 && user.points < tournament.entryFee) {
      return { success: false, message: `Insufficient points. Need ${tournament.entryFee} points to join.` };
    }

    return TournamentModel.joinTournament(tournamentId, userId);
  }

  static updateUserScore(tournamentId, userId, action, points = 0) {
    const tournament = TournamentModel.getTournamentById(tournamentId);
    
    if (!tournament || tournament.status !== 'active') {
      return { success: false };
    }

    // Calculate score based on action type
    let scoreIncrease = 0;
    switch (action) {
      case 'auction_bid':
        scoreIncrease = 10;
        break;
      case 'auction_win':
        scoreIncrease = 100;
        break;
      case 'campaign_complete':
        scoreIncrease = 50;
        break;
      case 'points_earned':
        scoreIncrease = Math.floor(points / 10); // 1 tournament point per 10 regular points
        break;
      default:
        scoreIncrease = 5;
    }

    return TournamentModel.updateLeaderboard(tournamentId, userId, scoreIncrease);
  }

  static calculateTimeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return { expired: true, display: "Tournament Ended" };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return {
      expired: false,
      days,
      hours,
      minutes,
      seconds,
      display: days > 0 
        ? `${days}d ${hours}h ${minutes}m`
        : hours > 0 
        ? `${hours}h ${minutes}m ${seconds}s`
        : `${minutes}m ${seconds}s`
    };
  }

  static getTournamentRewards(tournamentId, rank) {
    const tournament = TournamentModel.getTournamentById(tournamentId);
    if (!tournament) return 0;

    const { prizePool } = tournament;
    
    // Prize distribution based on rank
    switch (rank) {
      case 1: return Math.floor(prizePool * 0.5); // 50% for 1st place
      case 2: return Math.floor(prizePool * 0.3); // 30% for 2nd place
      case 3: return Math.floor(prizePool * 0.2); // 20% for 3rd place
      default: return rank <= 10 ? Math.floor(prizePool * 0.05) : 0; // Small rewards for top 10
    }
  }
}