export class AuctionModel {
  static getAuctions() {
    return [
      {
        id: 1,
        item: "Gift Card - $50 Amazon",
        currentBid: 200,
        timeLeft: "2h 15m",
        status: "active",
        minBidIncrement: 5
      },
      {
        id: 2,
        item: "Wireless Headphones",
        currentBid: 450,
        timeLeft: "5h 30m",
        status: "active",
        minBidIncrement: 10
      },
      {
        id: 3,
        item: "Smartwatch",
        currentBid: 800,
        timeLeft: "1d 3h",
        status: "active",
        minBidIncrement: 15
      }
    ];
  }

  static placeBid(auctionId, userId, bidAmount) {
    // Mock implementation
    console.log(`User ${userId} placing bid of ${bidAmount} on auction ${auctionId}`);
    return {
      success: true,
      newCurrentBid: bidAmount,
      message: "Bid placed successfully"
    };
  }
}