import { ReviewModel } from '../models/ReviewModel';

export class ReviewController {
  static getReviews() {
    return ReviewModel.getReviews();
  }

  static addHelpful(reviewId) {
    console.log(`Marked review ${reviewId} as helpful`);
    return true;
  }
}