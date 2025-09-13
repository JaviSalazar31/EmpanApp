import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  thumbnail: { type: String },
  code: { type: String, unique: true, required: true },
  stock: { type: Number, default: 0, index: true },
  category: { type: String, index: true },
  status: { type: Boolean, default: true } // disponible / no disponible
}, { timestamps: true });

// ...
productSchema.plugin(mongoosePaginate);

// ✅ export por defecto
const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;

