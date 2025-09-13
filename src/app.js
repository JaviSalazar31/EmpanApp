// src/app.js
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB } from './db.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';

dotenv.config();

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Handlebars + helpers + layout ---
// Vistas FUERA de src: EmpanApp/views
const viewsPath = path.join(__dirname, '..', 'views');

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(viewsPath, 'layouts'),
    helpers: {
      multiply: (a, b) => (Number(a) || 0) * (Number(b) || 0),
      eq: (a, b) => String(a) === String(b),
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', viewsPath);

// Routers
app.use(productsRouter); // /api/products
app.use(cartsRouter);    // /api/carts
app.use(viewsRouter);    // /products, /products/:pid, /carts/:cid

// Home → /products
app.get('/', (_req, res) => res.redirect('/products'));

// 404
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ status: 'error', error: 'Not found' });
  }
  return res.status(404).render('notfound', { layout: 'main' });
});

const PORT = process.env.PORT || 8080;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('✅ MongoDB conectado');
      console.log(`🚀 Server on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ Error al conectar a Mongo:', e);
    process.exit(1);
  });

