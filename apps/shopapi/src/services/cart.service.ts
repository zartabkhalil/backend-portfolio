import { AppError } from "../lib/appError.lib";
import CartRepository from "../repositories/cart.repository";
import ProductRepository from "../repositories/product.repository";
import { CreateCartInput, UpdateCartInput } from "../types/cart.types";

export default class CartService {
  private repository: CartRepository;
  private productRepository: ProductRepository;
  constructor() {
    this.repository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  create = async (data: CreateCartInput) => {
    //:: check product exist else throw 404
    const product = await this.productRepository.findById(data.productId);
    if (!product || product.isActive === false) {
      throw new AppError("Product not found", 404);
    }

    //check product stock is available for requested. quantity
    if (product.stock < data.quantity) {
      throw new AppError("Product is out of stock", 400);
    }

    //check:: if product is already in stock just update the quantity
    const alreadyExist = await this.repository.findByProductId(
      data.productId,
      data.userId,
    );

    if (alreadyExist) {
      //update quantity of already exist product
      const updatedQuantity = alreadyExist.quantity + data.quantity;
      return await this.repository.updateById(alreadyExist.id, {
        quantity: updatedQuantity,
      });
    } else {
      //create new item
      return await this.repository.create({
        quantity: Number(data.quantity),
        user: {
          connect: {
            id: data.userId,
          },
        },
        product: {
          connect: {
            id: data.productId,
          },
        },
      });
    }
  };

  getAll = async (userId: number) => {
    const result = await this.repository.findAll(userId);

    //compute total and afterDiscount
    const { total, afterDiscount } = result.reduce(
      (acc, item) => {
        const lineTotal = item.product.price * item.quantity;
        // discount is stored as a percentage (e.g. 10 means 10% off)
        const discountAmount = item.product.price - item.product.discount;

        return {
          total: acc.total + lineTotal,
          afterDiscount: discountAmount,
        };
      },
      { total: 0, afterDiscount: 0 },
    );

    const formatted = result.map((item) => ({
      ...item,

      products: item.product,

      product: undefined,
    }));
    const data = {
      cartTotal: total,
      afterDiscount,
      items: formatted,
    };
    return data;
  };

  updateById = async (
    loggedUser: number,
    cartId: number,
    data: UpdateCartInput,
  ) => {
    //:: find by id
    const existCart = await this.repository.findById(cartId);

    //:: if not exist throw error
    if (!existCart) {
      throw new AppError("Cart not found", 404);
    }

    //::check cart item belongs to he requesting user — throw 403 if not
    if (existCart.userId !== loggedUser) {
      throw new AppError("Forbidden:cart does not belongs to user", 403);
    }

    //:: Validate new quantity does not exceed stock
    if (data.quantity > existCart.product.stock) {
      throw new AppError("Product is out of stock", 400);
    }

    //:: remove the item if quantity is zero
    if (data.quantity === 0) {
      return await this.repository.deleteById(existCart.id);
    }

    return await this.repository.updateById(cartId, {
      quantity: data.quantity,
    });
  };

  deleteById = async (id: number, userId: number) => {
    const cart = await this.repository.findById(id);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    if (cart.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }
    return this.repository.deleteById(id);
  };
}
