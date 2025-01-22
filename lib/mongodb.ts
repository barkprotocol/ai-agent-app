// lib/mongodb.ts
import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI || 'your-mongodb-uri');
};

export { connectToDatabase };
