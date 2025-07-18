import { AuctionModel } from '../models/AuctionModel';

export class AuctionController {
  static getAuctions() {
    return AuctionModel.getAuctions();
  }

  static placeBid(auctionId, userId, bidAmount) {
    return AuctionModel.placeBid(auctionId, userId, bidAmount);
  }

  static getActiveAuctions() {
    return AuctionModel.getAuctions().filter(auction => auction.status === 'active');
  }
}