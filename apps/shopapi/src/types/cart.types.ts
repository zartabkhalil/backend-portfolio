export interface CreateCartInput {
  userId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartInput {
  userId: number;
  quantity: number;
}
