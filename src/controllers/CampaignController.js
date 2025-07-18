import { CampaignModel } from '../models/CampaignModel';

export class CampaignController {
  static getCampaigns() {
    return CampaignModel.getCampaigns();
  }

  static joinCampaign(campaignId, userId) {
    return CampaignModel.joinCampaign(campaignId, userId);
  }

  static getActiveCampaigns() {
    return CampaignModel.getCampaigns().filter(campaign => campaign.status === 'Active');
  }
}