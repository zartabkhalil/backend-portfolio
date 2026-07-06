import { AppError } from "../lib/appError.lib";
import CartRepository from "../repositories/cart.repository";
import OrderRepository from "../repositories/order.repository";

export default class OrderService {
  private orderRepository: OrderRepository;
  private cartRepository: CartRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.cartRepository = new CartRepository();
  }

  create = async (userId: number, address: string) => {
    //::>>>get all cart items for the logged in user -- if cart is empty  throw 400
    const cart = await this.cartRepository.findAll(userId);

    if (cart.length < 1) {
      throw new AppError("Cart is Empty", 400);
    }

    //::>>> for each cart item check product is still active and has enough stock
    cart.map((item) => {
      if (
        item.quantity > item.product.stock ||
        item.product.isActive == false
      ) {
        throw new AppError("Stock or Product is not enough", 400);
      }
    });

    //::>>> calculate total amount and apply discount
    const amount = cart.reduce((sum, item) => {
      return sum + (item.product.price - item.product.discount) * item.quantity;
    }, 0);

    //create order through transaction
    const order = {
      address: address,
      amount,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    //::>>> tranforming order items according to scheme from cart
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price - item.product.discount,
    }));

    return this.orderRepository.create(order, orderItems, userId);

    //::>>>
  };

  getMyOrders = async (userId: number) => {
    return this.orderRepository.findManyById(userId);
  };

  getAll = async () => {};

  getById = async (id: number, userId?: number) => {
    return this.orderRepository.findById(id, userId);
  };

  cancel = async (id: number, userId: number) => {};

  updateStatus = async (id: number, status: any) => {
    return this.orderRepository.updateById(id, { status });
  };
}
