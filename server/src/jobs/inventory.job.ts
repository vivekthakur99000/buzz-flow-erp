import cron from "node-cron";
import Product from "../models/product.model.js";

// This cron expression '0 8 * * *' means: "Run at 8:00 AM every single day"
// For testing purposes right now, let's run it every 1 minute: '* * * * *'

export const startInventoryJobs = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("⏳ [CRON JOB] Running automated low-stock check...");

    try {
     

      const lowStockProducts = await Product.find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } })


      if (lowStockProducts.length === 0) {
        console.log("✅ [CRON JOB] No low-stock products found.");
      } else {
        lowStockProducts.forEach((product) => {
          console.log(
            `🚨 ALERT: Product ${product.name} is running low! Only ${product.stock} left in stock.`
          );
        });
      }

      console.log("✅ [CRON JOB] Stock check complete.");
    } catch (error) {
      console.error("❌ [CRON JOB ERROR] Failed to check inventory:", error);
    }
  });
};