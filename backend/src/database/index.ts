// import { connection } from "./connection";

// connection.sync({
//   // force: true,
//   // alter: false,
// });

// export { connection };

import { connection } from "./connection";
import DemoDataSeeder from "../models/seeders/demo-data";

const seedDatabase = async () => {
  const queryInterface = connection.getQueryInterface();
  const seeder = new DemoDataSeeder();

  await connection.sync({ force: true });
  await seeder.up(queryInterface, connection);
  console.log("Data has been loaded into the database.");
};

connection
  .authenticate()
  .then(async () => {
    console.log("Connected to the database.");
    await seedDatabase();
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

export { connection };
