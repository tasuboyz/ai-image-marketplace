import mongoose from 'mongoose';
import winston from 'winston';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    winston.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      winston.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      winston.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      winston.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    winston.error('Database connection failed:', error);
    // Don't exit process for gallery demo
    console.log('⚠️  Continuing without database for gallery functionality...');
  }
};

export default connectDB;
