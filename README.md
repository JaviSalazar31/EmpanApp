# EmpanApp 🥟

Aplicación **Node.js + Express + MongoDB** para gestionar un catálogo de productos (empanadas y bebidas) y un carrito de compras básico, con vistas **Handlebars** y paginación en el listado.

## 🚀 Stack

- Node.js + Express
- MongoDB (Local o Atlas) con **Mongoose**
- Plantillas: **express-handlebars**
- Estilos: [Pico CSS](https://picocss.com/) (CDN)
- Herramientas: `nodemon`, `dotenv`, `mongoose-paginate-v2`

---

## 📦 Requisitos

- Node.js 18+ (recomendado 20+)
- MongoDB en local (o Atlas)
- Git

---

## 🔧 Configuración

1. Clonar el repo:
   ```bash
   git clone https://github.com/<tu-usuario>/<tu-repo>.git
   cd <tu-repo>
2. Instalar dependencias:
npm install
3. Crear archivo .env en la raíz:
MONGODB_URI=mongodb://localhost:27017/empanapp
PORT=3000
BASE_URL=http://localhost:3000
🛡️ Asegúrate de tener en .gitignore:
node_modules/
.env

### ▶️ Ejecutar el proyecto

Opción 1: modo desarrollo
npm run dev
Levanta el server con nodemon.
URL base: http://localhost:3000

Semillas (datos iniciales)

Para cargar datos de productos de ejemplo:

npm run seed

Verificar conexión a MongoDB (opcional)
npm run check:db

## 🧭 Rutas principales
Vistas (frontend)

GET /products → Listado con paginación, filtros y orden.

GET /products/:pid → Detalle de producto.

GET /carts/:cid → Vista del carrito.

API (JSON)

GET /api/products → Lista paginada (query, sort, limit, page).

GET /api/products/:pid → Detalle JSON.

POST /api/carts → Crea carrito.

POST /api/carts/:cid/products/:pid → Agrega producto al carrito.

PUT /api/carts/:cid/products/:pid → Actualiza cantidad.

DELETE /api/carts/:cid/products/:pid → Elimina un producto del carrito.

DELETE /api/carts/:cid → Vacía el carrito.

La UI usa estas rutas Ajax para agregar/actualizar el carrito.

## 🗂️ Estructura del proyecto
EmpanApp/
├─ src/
│  ├─ app.js                 # Express + Handlebars + routers
│  ├─ db.js                  # Conexión a MongoDB (Mongoose)
│  ├─ controllers/
│  │  ├─ products.controller.js
│  │  └─ carts.controller.js
│  ├─ models/
│  │  ├─ product.model.js
│  │  └─ cart.model.js
│  ├─ routes/
│  │  ├─ products.router.js
│  │  ├─ carts.router.js
│  │  └─ views.router.js
│  └─ utils/
│     └─ buildPageLinks.js   # helper para paginación (prev/next links)
├─ views/                    # (fuera de src) Vistas Handlebars
│  ├─ layouts/
│  │  └─ main.handlebars
│  ├─ products.handlebars
│  ├─ productDetail.handlebars
│  ├─ cart.handlebars
│  └─ notfound.handlebars
├─ scripts/
│  ├─ seed.js                # carga datos de ejemplo
│  └─ check-db.js            # prueba de conexión a Mongo
├─ .env
├─ .gitignore
├─ package.json
└─ README.md

## 🧪 Queries de ejemplo

Búsqueda por categoría (UI o API):

/products?query=category:Saladas
/api/products?query=category:Saladas


Orden por precio asc/desc:

/products?sort=asc
/products?sort=desc


Límite y página:

/products?limit=5&page=2

## 🧰 Scripts disponibles

package.json incluye:

{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "check:db": "node scripts/check-db.js",
    "seed": "node scripts/seed.js"
  }
}

## 💡 Notas de implementación

Vistas fuera de src: En src/app.js la app está configurada para leer views/ (hermanas de src/).

Helpers de Handlebars: multiply (subtotal) y eq (comparaciones simples).

Carrito: la UI guarda cartId en localStorage y llama a la API.

Paginación: mongoose-paginate-v2 + util buildPageLinks.js para construir prevLink/nextLink.

## 🐞 Troubleshooting

The requested module ... does not provide an export named 'X'
Asegúrate de que el modelo exporte exactamente lo que importas (export nombrado vs default).

Ej.:

export const ProductModel = mongoose.model('Product', productSchema);
// o export default ProductModel; (y ajustas los imports)


EADDRINUSE: address already in use :::3000
Ya tienes algo usando ese puerto. Cambia PORT en .env o cierra el proceso que lo usa.

Página en blanco en /products
Verifica que viewsPath apunte correctamente a views/ y que existan layouts/main.handlebars y products.handlebars.

Mongo no conecta
Revisa que el servicio esté levantado (mongod) y que MONGODB_URI sea correcto.

## 📜 Licencia

MIT. Úsala, mejórala y contame si te sirvió 🙌

## 👤 Autor

Javier Salazar