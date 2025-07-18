export class CampaignModel {
  static getCampaigns() {
    return [
      {
        id: 1,
        name: "Summer Sale",
        points: 500,
        status: "Active",
        description: "Complete purchases during summer to earn bonus points",
        endDate: "2024-08-31"
      },
      {
        id: 2,
        name: "Back to School",
        points: 300,
        status: "Active",
        description: "Special campaign for school supplies and electronics",
        endDate: "2024-09-15"
      },
      {
        id: 3,
        name: "Holiday Shopping",
        points: 750,
        status: "Coming Soon",
        description: "Earn extra points on all holiday purchases",
        endDate: "2024-12-31"
      }
    ];
  }

  static joinCampaign(campaignId, userId) {
    // Mock implementation
    console.log(`User ${userId} joining campaign ${campaignId}`);
    return true;
  }
}