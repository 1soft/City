import { Database, MongoClient } from "../deps.ts";

class DatabaseSingleton {
  private static instance: Database | null = null;

  static async getInstance(): Promise<Database> {
    if (!this.instance) {
      const client = new MongoClient();
      const uri = Deno.env.get("MONGO_URI") || "mongodb://root:rootpassword@mongo-container:27017";

      let attempts = 3;
      while (attempts > 0) {
        try {
          await client.connect(uri);
          this.instance = client.database("tasksDB");
          console.log("✅ Connected to MongoDB!");
          break;
        } catch (error) {
          console.error(`❌ MongoDB connection failed. Retrying in 5s... (${error} attempts left)`);
          attempts--;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      if (!this.instance) {
        throw new Error("❌ Could not connect to MongoDB after multiple attempts.");
      }
    }
    return this.instance;
  }
}

export default DatabaseSingleton;
