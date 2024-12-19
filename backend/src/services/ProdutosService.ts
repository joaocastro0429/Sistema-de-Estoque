import { prisma } from '../prisma/index';

// Define the interface for a product
export interface Product {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
};

// Fetch all products
export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Error fetching products');
  }
};

// Function to create a product
export const createProduct = async ({ name, description, price, quantity }: Product) => {
  try {
    // Check if a product with the same name, description, price, and quantity already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
        description,
        price,
        quantity,
      },
    });

    // If the product exists, throw an error
    if (existingProduct) {
      throw new Error('Product with the same name, description, price, and quantity already exists.');
    }

    // If no duplicate is found, proceed to create the new product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
      },
    });
    return product;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Error creating product');
  }
};


// Function to update a product
export const updateProduct = async (id: number, data: { name: string; description: string; quantity: number; price: number }): Promise<Product> => {
  return prisma.product.update({
    where: { id },
    data,
  });
}

// Function to delete a product
export const deleteProduct = async (id: number) => {
  try {
    const product = await prisma.product.delete({
      where: { id },
    });
    return product;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Error deleting product');
  }
};
