import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

class DatabaseConnection {
  retryCount: number;
  isConnected: boolean;

  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    // Configure mongoose settings
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      console.log("MONGODB Connected successfully");
      this.isConnected = true;
    });

    mongoose.connection.on("error", () => {
      console.log("MONGODB Connection error");
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MONGODB Disconnected");
      this.isConnected = false;
      this.handleDisconnection();
    });

    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error("MONGO DB URI is not defined in env variables");
      }

      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4
      };

      if (process.env.NODE_ENV === "dev") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(process.env.MONGO_URI, connectionOptions);
      this.retryCount = 0; // Reset retry count on success
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
      await this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount += 1;
      console.log(
        `Retrying connection... Attempt ${this.retryCount} of ${MAX_RETRIES}`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      return this.connect();
    } else {
      console.log(`Failed to connect to MONGODB after ${MAX_RETRIES} attempts`);
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attempting to reconnect to MONGODB...");
      await this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    } catch (error) {
      console.log("Error during database disconnection", error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

// Create a singleton instance
const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
