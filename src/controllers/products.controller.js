import ProductModel from '../models/product.model.js';
import buildPageLinks from '../utils/buildPageLinks.js';

/**
 * GET /api/products
 * Query: limit, page, sort (asc|desc), query
 * query soporta:
 *  - "category:Saladas"  -> { category: 'Saladas' }
 *  - "available:true|false" -> { status: true|false }
 *  - "stock:true" -> { stock: { $gt: 0 } }
 *  - texto libre -> busca por título o categoría (regex)
 */
export async function getProducts(req, res) {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      const q = String(query).trim();
      if (q.startsWith('category:')) {
        filter.category = q.split(':')[1];
      } else if (q.startsWith('available:')) {
        const val = q.split(':')[1];
        filter.status = val === 'true';
      } else if (q === 'stock:true') {
        filter.stock = { $gt: 0 };
      } else {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ];
      }
    }

    const sortObj = {};
    if (sort === 'asc') sortObj.price = 1;
    if (sort === 'desc') sortObj.price = -1;

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: Object.keys(sortObj).length ? sortObj : undefined,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    const { prevLink, nextLink } = buildPageLinks({
      baseUrl: process.env.BASE_URL,
      pathname: '/api/products',
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      originalQuery: { ...req.query, limit: options.limit }
    });

    return res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', error: err.message });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    return res.json({ status: 'success', payload: product });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
}
