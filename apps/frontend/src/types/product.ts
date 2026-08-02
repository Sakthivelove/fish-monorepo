export type Product = {
  id: string;

  tamilName: string;

  name?: string | null;

  description: string | null;

  pricePerKg: number;

  imageUrl: string;

  category: string;

  stockQuantityGrams: number;

  isActive: boolean;

  createdAt: string;
};