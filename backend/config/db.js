import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      console.error(
        'Error connecting to MongoDB: Missing MONGODB_URI (or MONGO_URI) in environment.'
      );
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Common Atlas issue on some networks: DNS resolution fails (ENOTFOUND)
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (String(error.message || '').includes('ENOTFOUND')) {
      console.error(
        'MongoDB Atlas DNS lookup failed (ENOTFOUND). Check your internet/DNS, VPN/proxy, firewall, and that the connection string host is correct.'
      );
    }
    process.exit(1);
  }
};

export default connectDB;
