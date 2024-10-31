import { connection } from "./connection";

connection.sync({
  force: false,
  alter: false,
});

export { connection };

// import { connection } from "./connection";
// import DemoDataSeeder from "../models/seeders/demo-data"; // Upewnij się, że ścieżka jest poprawna

// const seedDatabase = async () => {
//   const queryInterface = connection.getQueryInterface();
//   const seeder = new DemoDataSeeder();

//   // Synchronizuj bazę danych z ustawieniami force i alter
//   await connection.sync({ force: false, alter: false }); // Ustaw force i alter na false
//   await seeder.up(queryInterface, connection); // Użyj connection.getQueryInterface() dla Sequelize

//   console.log("Dane zostały załadowane do bazy danych.");
// };

// // Synchronizacja połączenia i uruchomienie seeda
// connection
//   .authenticate()
//   .then(async () => {
//     console.log("Połączono z bazą danych.");
//     await seedDatabase(); // Uruchom seedowanie
//   })
//   .catch((error) => {
//     console.error("Błąd podczas łączenia z bazą danych:", error);
//   });

// export { connection };
