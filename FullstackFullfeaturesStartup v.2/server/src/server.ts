import { app } from "./app";
import { config } from "./config/env";
import { bootstrapAdmin } from "./utils/bootstrapAdmin";

async function startServer() {
  try {
    await bootstrapAdmin();

    app.listen(Number(config.PORT), "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
