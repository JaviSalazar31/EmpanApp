import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    dbName: 'empanapp',
    serverSelectionTimeoutMS: 5000, 
  });
  console.log('✅ MongoDB conectado'); 
}
