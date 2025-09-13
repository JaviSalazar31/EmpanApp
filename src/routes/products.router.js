import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/products.controller.js';
import ProductModel from '../models/product.model.js';

export const productsRouter = Router();

// API
productsRouter.get('/api/products', getProducts);
productsRouter.get('/api/products/:pid', getProductById);

// Vistas
productsRouter.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = {};
  if (query) {
    const q = String(query).trim();
    if (q.startsWith('category:')) filter.category = q.split(':')[1];
    else if (q.startsWith('available:')) filter.status = q.split(':')[1] === 'true';
    else if (q === 'stock:true') filter.stock = { $gt: 0 };
    else filter.$or = [{ title: { $regex: q, $options: 'i' } }, { category: { $regex: q, $options: 'i' } }];
  }

  const sortObj = {};
  if (sort === 'asc') sortObj.price = 1;
  if (sort === 'desc') sortObj.price = -1;

  const result = await ProductModel.paginate(filter, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    sort: Object.keys(sortObj).length ? sortObj : undefined,
    lean: true
  });

  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const prevLink = result.hasPrevPage
    ? `${baseUrl}/products?${new URLSearchParams({ ...req.query, page: result.prevPage })}`
    : null;
  const nextLink = result.hasNextPage
    ? `${baseUrl}/products?${new URLSearchParams({ ...req.query, page: result.nextPage })}`
    : null;

  return res.render('products', {
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink,
    nextLink,
    query, sort, limit
  });
});

productsRouter.get('/products/:pid', async (req, res) => {
  const product = await ProductModel.findById(req.params.pid).lean();
  if (!product) return res.status(404).render('products', { status: 'error', error: 'Producto no encontrado' });
  res.render('productDetail', { product });
});
