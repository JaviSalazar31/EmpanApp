import { Router } from 'express';
import {
  addProductToCart,
  clearCart,
  createCart,
  deleteProductFromCart,
  getCart,
  replaceCartProducts,
  updateProductQuantity
} from '../controllers/carts.controller.js';

export const cartsRouter = Router();

// API
cartsRouter.post('/api/carts', createCart);
cartsRouter.get('/api/carts/:cid', getCart);
cartsRouter.post('/api/carts/:cid/products/:pid', addProductToCart);
cartsRouter.delete('/api/carts/:cid/products/:pid', deleteProductFromCart);
cartsRouter.put('/api/carts/:cid', replaceCartProducts);
cartsRouter.put('/api/carts/:cid/products/:pid', updateProductQuantity);
cartsRouter.delete('/api/carts/:cid', clearCart);

// Vista carrito
cartsRouter.get('/carts/:cid', async (req, res) => {
  try {
    const base = process.env.BASE_URL || `http://${req.get('host')}`;
    const resp = await fetch(`${base}/api/carts/${req.params.cid}`);
    const data = await resp.json();
    if (data.status !== 'success') throw new Error(data.error);
    res.render('cart', { cart: data.payload });
  } catch (e) {
    res.status(404).render('cart', { error: e.message });
  }
});
