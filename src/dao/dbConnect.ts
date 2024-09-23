import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER! || "tt",
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    //   logging: (msg) => {
    //     //   sqlLogger.debug(msg);
    //     console.log(msg)
    //   },
    logging: false,
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
export default sequelize;
