// scripts/seed.js
import dotenv from 'dotenv';
import { connectDB } from '../src/db.js';
import ProductModel from '../src/models/product.model.js';

dotenv.config();

await connectDB(process.env.MONGODB_URI);

await ProductModel.deleteMany({});
await ProductModel.insertMany([
  { title:'Empanada de Carne', description:'Jugosa con cebolla y huevo', price:800, code:'EMP001', stock:50, category:'Saladas', status:true },
  { title:'Empanada de Pollo', description:'Pollo con morrón', price:800, code:'EMP002', stock:40, category:'Saladas', status:true },
  { title:'Empanada Jamón y Queso', description:'Clásica', price:850, code:'EMP003', stock:30, category:'Saladas', status:true },
  { title:'Empanada de Humita', description:'Maíz cremoso', price:850, code:'EMP004', stock:25, category:'Saladas', status:true },
  { title:'Empanada Dulce de Batata', description:'Dulce casero', price:700, code:'EMP005', stock:20, category:'Dulces', status:true },
  { title:'Coca-Cola 500ml', description:'Refresco', price:600, code:'BEB001', stock:60, category:'Bebidas', status:true },
  { title:'Agua Mineral 500ml', description:'Sin gas', price:500, code:'BEB002', stock:70, category:'Bebidas', status:true }
]);

console.log('✅ Datos iniciales cargados en Mongo local');
process.exit(0);
