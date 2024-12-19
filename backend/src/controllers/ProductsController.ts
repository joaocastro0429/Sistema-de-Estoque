import { Request, Response } from "express";
import { createProduct, getProducts, deleteProduct, updateProduct } from '../services/ProdutosService';

export const getProductsAll = async (req: Request, res: Response) => {
  try {
    const products = await getProducts(); // Obtem os produtos
    res.status(200).json(products);      // Envia a resposta ao cliente
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};
export const createProducts = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity } = req.body;

    // Attempt to create the product
    const product = await createProduct({ name, description, price, quantity });

    // If creation is successful, return the product
    res.status(201).json(product);
  } catch (error: any) {
    // Return error message if product creation fails
    res.status(400).json({ error: error.message || 'Error while creating product' });
  }
};
export const updateProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const updatedProduct = await updateProduct(Number(id), { name, description, quantity, price });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }

}

export const deleteProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProduct(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
}
