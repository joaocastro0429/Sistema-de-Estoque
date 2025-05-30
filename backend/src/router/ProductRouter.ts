import { Router } from "express";
import { 
    getProductsAll, 
    createProducts,
    updateProducts,
    deleteProducts
} from '../controllers/ProductsController';
import { authMiddleware } from "../middleware/auth";

export const router = Router();

router.get('/getProducts', getProductsAll);

// Rotas protegidas por autenticação
router.post('/addProducts', authMiddleware, createProducts);
router.put('/updateProducts/:id', authMiddleware, updateProducts);
router.delete('/deleteProducts/:id', authMiddleware, deleteProducts);

