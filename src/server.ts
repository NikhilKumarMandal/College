import app from "./app";
import connectDB from "./config/db";
import { Config } from "./config";
const PORT = Config.PORT || 8000;

// Connect to database
const startServer = async () => {
  console.log(Config.MONGO_URI);
  console.log(PORT);

  await connectDB();

  app.listen(PORT, () => {
    console.log(
      ` Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

startServer();
