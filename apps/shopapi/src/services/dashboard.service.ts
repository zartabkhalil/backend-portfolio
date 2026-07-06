import DashboardRepository from "../repositories/dashboard.repository";
import OrderRepository from "../repositories/order.repository";
import PaymentRepository from "../repositories/payment.repository";
import ProductRepository from "../repositories/product.repository";
import UserRepoistory from "../repositories/user.repository";

export default class DashboardService {
  private repository: DashboardRepository;
  private userRepo: UserRepoistory;
  private productRepo: ProductRepository;
  private paymentRepo: PaymentRepository;
  private ordersRepo: OrderRepository;
  constructor() {
    this.repository = new DashboardRepository();
    this.userRepo = new UserRepoistory();
    this.productRepo = new ProductRepository();
    this.paymentRepo = new PaymentRepository();
    this.ordersRepo = new OrderRepository();
  }

  getStats = async (userId: number) => {
    const customers = await this.userRepo.countCustomers();
    const products = await this.productRepo.totalProducts();
    const revenue = await this.paymentRepo.sumCompleted();
    const orders = await this.ordersRepo.countOrder();
    const countOrdersByStatus = await this.ordersRepo.countOrdersByStatus();
    const recentOrders = await this.ordersRepo.recentOrders();
    const topProducts = await this.productRepo.topProducts();
    const response = {
      totalCustomers: customers,
      totalProducts: products,
      totalRevenue: revenue,
      totalOrders: orders,
      ordersByStatus: countOrdersByStatus,
      recentOrders: recentOrders,
      topProducts: topProducts,
    };

    return response;
  };
}
