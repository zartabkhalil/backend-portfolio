import { OrderStatus, PaymentStatus } from "@prisma/client";
import Stripe from "stripe";
import stripe from "../config/stripe";
import { AppError } from "../lib/appError.lib";
import OrderRepository from "../repositories/order.repository";
import PaymentRepository from "../repositories/payment.repository";
export default class PaymentService {
  private paymentRepository: PaymentRepository;
  private orderRepository: OrderRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.orderRepository = new OrderRepository();
  }

  create = async (orderId: number, userId: number) => {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Order Not Found", 400);
    }

    if (order.userId !== userId)
      throw new AppError("Order does not belong to you", 403);

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError("Cannot pay for already paid Orders", 400);
    }

    //creating a stripe intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100),
      currency: "usd",
      metadata: { orderId: order.id.toString() },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  };

  webhook = async (event: Stripe.Event) => {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const order = await this.orderRepository.findById(Number(orderId));
        if (!order) {
          throw new AppError("Order Not Found on webhook", 404);
        }
        await this.paymentRepository.create(
          {
            order: {
              connect: {
                id: Number(orderId),
              },
            },
            user: {
              connect: {
                id: Number(order.userId),
              },
            },
            amount: order.amount,
            status: PaymentStatus.COMPLETED,
            paymentMethod: "CARD",
            stripePaymentId: paymentIntent.id,
          },
          Number(orderId),
          OrderStatus.PROCESSING,
        );
        break;
      case "charge.updated":
        console.log("insdie charge.updated :Payment successful");
        break;

      case "payment_intent.payment_failed":
        console.log("Payment failed");
        break;

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  };
}
