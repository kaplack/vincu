const app = require("./app");
const { PORT, NODE_ENV } = require("./config/env");
const { sequelize } = require("./models");

async function start() {
  try {
    await sequelize.authenticate();
    console.log("[VINCU] DB connected");

    if (NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("[VINCU] DB synced (dev)");
    }

    app.listen(PORT, () => {
      console.log(`[VINCU] Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[VINCU] DB connection error:", err);
    process.exit(1);
  }
}

start();
