import { Sequelize } from "sequelize";

const sequelize = new Sequelize("site", "tt", "123456@Test", {
  host: "localhost",
  dialect: "mysql",
  //   logging: (msg) => {
  //     //   sqlLogger.debug(msg);
  //     console.log(msg)
  //   },
});

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
export default sequelize;
