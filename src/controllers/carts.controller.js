import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

export async function createCart(req, res) {
  const cart = await CartModel.create({ products: [] });
  return res.status(201).json({ status: 'success', payload: cart });
}

export async function getCart(req, res) {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid).populate('products.product').lean();
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
  return res.json({ status: 'success', payload: cart });
}

export async function addProductToCart(req, res) {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

  const product = await ProductModel.findById(pid);
  if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });

  const existing = cart.products.find(p => p.product.equals(pid));
  if (existing) existing.quantity += 1;
  else cart.products.push({ product: pid, quantity: 1 });

  await cart.save();
  return res.json({ status: 'success', payload: cart });
}

export async function deleteProductFromCart(req, res) {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

  cart.products = cart.products.filter(p => !p.product.equals(pid));
  await cart.save();
  return res.json({ status: 'success', payload: cart });
}

export async function replaceCartProducts(req, res) {
  const { cid } = req.params;
  const { products = [] } = req.body;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

  cart.products = products.map(p => ({ product: p.product, quantity: p.quantity ?? 1 }));
  await cart.save();
  return res.json({ status: 'success', payload: cart });
}

export async function updateProductQuantity(req, res) {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  if (Number.isNaN(Number(quantity)) || Number(quantity) < 1) {
    return res.status(400).json({ status: 'error', error: 'quantity inválido' });
  }

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

  const item = cart.products.find(p => p.product.equals(pid));
  if (!item) return res.status(404).json({ status: 'error', error: 'Producto no está en el carrito' });

  item.quantity = Number(quantity);
  await cart.save();
  return res.json({ status: 'success', payload: cart });
}

export async function clearCart(req, res) {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
  cart.products = [];
  await cart.save();
  return res.json({ status: 'success', payload: cart });
}