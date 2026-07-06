import { AppError } from "../lib/appError.lib";
import ProductRepository from "../repositories/product.repository";
import ReviewRepository from "../repositories/review.repository";
import { CreateReviewsInput } from "../types/review.type";

export default class ReviewService {
  private repository: ReviewRepository;
  private productRepo: ProductRepository;
  constructor() {
    this.repository = new ReviewRepository();
    this.productRepo = new ProductRepository();
  }

  create = async (userId: number, data: CreateReviewsInput) => {
    const { productId, reviews, ratings } = data;
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new AppError("Product Not Found", 404);
    }
    //>....checking that user actully order or not
    const hasPurchasedProduct = await this.productRepo.hasPurchasedProduct(
      userId,
      productId,
    );

    if (!hasPurchasedProduct) {
      throw new AppError(
        "Cannot Place Review for Product that user have not bought",
        400,
      );
    }

    //>....Check customer has not already reviewed this product
    const alreadyReview = await this.repository.findByProductAndUserId(
      userId,
      productId,
    );
    if (alreadyReview) {
      throw new AppError("Cannot Place Review again for same Product ", 400);
    }

    return await this.repository.create({
      product: {
        connect: {
          id: productId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      reviews,
      ratings,
    });
  };

  getById = async (id: number) => {};

  getAllByProduct = async (productId: number) => {
    const data = await this.repository.findAllByProduct(productId);
    const averageRating =
      data.reduce((sum, item) => sum + item.ratings, 0) / data.length;
    const finalData = {
      averageRating,
      totalRatings: data.length,
      reviews: data,
    };
    return finalData;
  };

  getAllByUser = async (userId: number, page: number, limit: number) => {};

  updateById = async (id: number, data: any) => {};

  deleteById = async (id: number, userId: number) => {
    const review = await this.repository.findById(id);
    //>..if review not exist
    if (!review) {
      throw new AppError("Review not found", 404);
    }
    console.log("reve", review, review?.userId, userId);
    if (review.userId != userId) {
      throw new AppError("Cannot delete review that you dont' own", 400);
    }
    return await this.repository.deleteById(id);
  };
}
