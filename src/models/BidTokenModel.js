export class BidTokenModel {
  static userBidTokens = new Map(); // In-memory storage for demo

  static getUserBidTokens(userId) {
    if (!this.userBidTokens.has(userId)) {
      this.userBidTokens.set(userId, {
        balance: 0,
        earned: 0,
        spent: 0,
        transactions: []
      });
    }
    return this.userBidTokens.get(userId);
  }

  static addBidTokens(userId, amount, source, metadata = {}) {
    const userTokens = this.getUserBidTokens(userId);
    
    userTokens.balance += amount;
    userTokens.earned += amount;
    
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'earned',
      amount,
      source,
      metadata,
      timestamp: new Date().toISOString(),
      balance: userTokens.balance
    };
    
    userTokens.transactions.unshift(transaction);
    
    // Keep only last 100 transactions
    if (userTokens.transactions.length > 100) {
      userTokens.transactions = userTokens.transactions.slice(0, 100);
    }
    
    this.userBidTokens.set(userId, userTokens);
    
    return {
      success: true,
      newBalance: userTokens.balance,
      tokensAdded: amount,
      transaction
    };
  }

  static spendBidTokens(userId, amount, purpose, metadata = {}) {
    const userTokens = this.getUserBidTokens(userId);
    
    if (userTokens.balance < amount) {
      return {
        success: false,
        error: 'insufficient_tokens',
        required: amount,
        available: userTokens.balance
      };
    }
    
    userTokens.balance -= amount;
    userTokens.spent += amount;
    
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'spent',
      amount,
      purpose,
      metadata,
      timestamp: new Date().toISOString(),
      balance: userTokens.balance
    };
    
    userTokens.transactions.unshift(transaction);
    this.userBidTokens.set(userId, userTokens);
    
    return {
      success: true,
      newBalance: userTokens.balance,
      tokensSpent: amount,
      transaction
    };
  }

  static getBidTokenAnalytics(userId) {
    const userTokens = this.getUserBidTokens(userId);
    
    // Calculate earning sources
    const earningSources = {};
    const spendingPurposes = {};
    const monthlyEarnings = {};
    
    userTokens.transactions.forEach(tx => {
      const month = new Date(tx.timestamp).toISOString().substr(0, 7);
      
      if (tx.type === 'earned') {
        earningSources[tx.source] = (earningSources[tx.source] || 0) + tx.amount;
        monthlyEarnings[month] = (monthlyEarnings[month] || 0) + tx.amount;
      } else if (tx.type === 'spent') {
        spendingPurposes[tx.purpose] = (spendingPurposes[tx.purpose] || 0) + tx.amount;
      }
    });

    return {
      balance: userTokens.balance,
      totalEarned: userTokens.earned,
      totalSpent: userTokens.spent,
      earningSources,
      spendingPurposes,
      monthlyEarnings,
      recentTransactions: userTokens.transactions.slice(0, 20),
      averageEarningPerReceipt: this.calculateAverageEarningPerReceipt(userTokens.transactions)
    };
  }

  static calculateAverageEarningPerReceipt(transactions) {
    const receiptTransactions = transactions.filter(tx => 
      tx.type === 'earned' && tx.source === 'receipt_processing'
    );
    
    if (receiptTransactions.length === 0) return 0;
    
    const totalEarned = receiptTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    return Math.round((totalEarned / receiptTransactions.length) * 100) / 100;
  }

  static getBidTokenLeaderboard(limit = 10) {
    const leaderboard = Array.from(this.userBidTokens.entries())
      .map(([userId, data]) => ({
        userId,
        balance: data.balance,
        totalEarned: data.earned
      }))
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit);
    
    return leaderboard;
  }
}