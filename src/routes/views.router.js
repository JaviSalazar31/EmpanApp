// src/routes/views.router.js
import { Router } from 'express';
import  ProductModel  from '../models/product.model.js';
import { buildPageLinks } from '../utils/buildPageLinks.js';

export const viewsRouter = Router();

/** LISTA DE PRODUCTOS (render) */
viewsRouter.get('/products', async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro interpretando query tipo "category:Saladas" | "available:true" | "stock:true"
    const filter = {};
    if (query) {
      const [k, v] = String(query).split(':');
      if (k && v !== undefined) {
        if (k === 'available' || k === 'status') filter.status = v === 'true';
        else if (k === 'stock') filter.stock = v === 'true' ? { $gt: 0 } : 0;
        else filter[k] = v;
      }
    }

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      lean: true
    };
    if (sort === 'asc' || sort === 'desc') {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const result = await ProductModel.paginate(filter, options);

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
    const links = buildPageLinks({
      baseUrl,
      pathname: '/products',
      page: result.page,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      originalQuery: { limit: options.limit, sort, query }
    });

    // ¡IMPORTANTE!: la vista usa "payload"
    res.render('products', {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: links.prevLink,
      nextLink: links.nextLink,
      // mantener valores del formulario
      limit: options.limit,
      sort,
      query
    });
  } catch (err) {
    next(err);
  }
});

/** DETALLE DE PRODUCTO (render) */
viewsRouter.get('/products/:pid', async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).render('notfound', { layout: 'main' });
    res.render('productDetail', { product });
  } catch (err) { next(err); }
});

/** HOME → redirige a /products */
viewsRouter.get('/', (_req, res) => res.redirect('/products'));
