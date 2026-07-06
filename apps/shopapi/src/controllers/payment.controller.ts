import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../config/stripe";
import { AppError } from "../lib/appError.lib";
import PaymentService from "../services/payment.service";
export default class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createIntent = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { orderId } = req.body;
    const data = await this.paymentService.create(Number(orderId), userId);
    return res.status(200).json({
      success: true,
      message: "Payment Intent",
      data,
    });
  };

  webhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError("STRIPE_WEBHOOK_SECRET is not set yet", 400);
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err) {
      return res.status(400).json({
        received: false,
        message: "Webhook signature verification failed",
      });
    }

    await this.paymentService.webhook(event);

    return res.json({
      received: true,
    });
  };
}
