export class TournamentModel {
  static getTournaments() {
    return [
      {
        id: 1,
        name: "Weekly Auction Challenge",
        description: "Compete to win the most auctions this week and earn exclusive rewards!",
        type: "auction",
        status: "active",
        startDate: "2024-03-18",
        endDate: "2024-03-25",
        maxParticipants: 100,
        currentParticipants: 47,
        prizePool: 5000,
        entryFee: 0,
        leaderboard: [
          { rank: 1, userId: 1, name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", score: 2850, auctionsWon: 12 },
          { rank: 2, userId: 2, name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", score: 2640, auctionsWon: 10 },
          { rank: 3, userId: 3, name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100", score: 2420, auctionsWon: 9 },
          { rank: 4, userId: 4, name: "David Kim", score: 2180, auctionsWon: 8 },
          { rank: 5, userId: 5, name: "Lisa Thompson", score: 1950, auctionsWon: 7 },
          { rank: 6, userId: 6, name: "Alex Johnson", score: 1820, auctionsWon: 6 },
          { rank: 7, userId: 7, name: "Maria Garcia", score: 1650, auctionsWon: 5 },
          { rank: 8, userId: 8, name: "James Wilson", score: 1480, auctionsWon: 4 }
        ]
      },
      {
        id: 2,
        name: "Points Master Championship",
        description: "Earn the most points through campaigns and activities to claim victory!",
        type: "points",
        status: "active",
        startDate: "2024-03-15",
        endDate: "2024-03-30",
        maxParticipants: 200,
        currentParticipants: 156,
        prizePool: 10000,
        entryFee: 50,
        leaderboard: [
          { rank: 1, userId: 2, name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", score: 15420, pointsEarned: 15420 },
          { rank: 2, userId: 1, name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", score: 14850, pointsEarned: 14850 },
          { rank: 3, userId: 3, name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100", score: 13200, pointsEarned: 13200 },
          { rank: 4, userId: 4, name: "David Kim", score: 12800, pointsEarned: 12800 },
          { rank: 5, userId: 5, name: "Lisa Thompson", score: 11900, pointsEarned: 11900 }
        ]
      },
      {
        id: 3,
        name: "Spring Campaign Sprint",
        description: "Complete the most campaigns in record time to win amazing prizes!",
        type: "campaign",
        status: "upcoming",
        startDate: "2024-04-01",
        endDate: "2024-04-15",
        maxParticipants: 150,
        currentParticipants: 0,
        prizePool: 7500,
        entryFee: 25,
        leaderboard: []
      }
    ];
  }

  static getTournamentById(id) {
    return this.getTournaments().find(tournament => tournament.id === id);
  }

  static getActiveTournaments() {
    return this.getTournaments().filter(tournament => tournament.status === 'active');
  }

  static getUpcomingTournaments() {
    return this.getTournaments().filter(tournament => tournament.status === 'upcoming');
  }

  static joinTournament(tournamentId, userId) {
    // Mock implementation - in real app, this would update database
    console.log(`User ${userId} joining tournament ${tournamentId}`);
    return { success: true, message: "Successfully joined tournament!" };
  }

  static updateLeaderboard(tournamentId, userId, score) {
    // Mock implementation - in real app, this would update database
    console.log(`Updating leaderboard for tournament ${tournamentId}: User ${userId} scored ${score}`);
    return { success: true };
  }
}