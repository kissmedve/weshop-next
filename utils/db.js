const mongoose = require("mongoose");

// connect to mongodb

let isConnected = false;

export const connectDB = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI, {
      ignoreUndefined: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  isConnected = true;
};
