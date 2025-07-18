export class ReviewModel {
  static getReviews() {
    return [
      {
        id: 1,
        userId: 1,
        userName: "Sarah Johnson",
        rating: 5,
        title: "Amazing Rewards Program!",
        content: "I've earned so many points through receipt uploads. The auctions are super fun!",
        date: "2024-03-15",
        helpful: 24,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
      },
      {
        id: 2,
        userId: 2,
        userName: "Michael Chen",
        rating: 4,
        title: "Great Platform",
        content: "The campaigns are well designed and the points system is fair. Would love to see more auction items.",
        date: "2024-03-14",
        helpful: 15,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
      },
      {
        id: 3,
        userId: 3,
        userName: "Emily Rodriguez",
        rating: 5,
        title: "Excellent Customer Service",
        content: "The support team is amazing! They helped me with my points redemption quickly.",
        date: "2024-03-13",
        helpful: 19,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
      }
    ];
  }
}