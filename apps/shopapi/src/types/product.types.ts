import { Product } from "@prisma/client";

export interface CreateProductInput {
  title: string;
  price: number;
  categoryId: number;
  image: string | null;
  description: string | null;
  stock: number;
  discount: number;
}

export interface UpdateProductInput {
  title?: string;
  price?: number;
  categoryId?: number;
  image?: string | null;
  description?: string | null;
  stock?: number;
  discount?: number;
}

export type PaginatedProducts = {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
