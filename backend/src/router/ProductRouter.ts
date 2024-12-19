import { Router } from "express";
import { 
    getProductsAll , 
    createProducts ,
    updateProducts,
     deleteProducts
    } from '../controllers/ProductsController'
import { authMiddleware } from "src/middleware/auth";

export const router = Router();


router.get('/getProducts', getProductsAll)
router.post('/addProducts', createProducts)
router.put('/updateProducts/:id' , updateProducts)
router.delete('/deleteProducts/:id' , deleteProducts)



