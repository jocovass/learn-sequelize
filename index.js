const { Sequelize } = require("sequelize");

// const seqInstance = new Sequelize("postgresql://localhost:5432/joco");
const seqInstance = new Sequelize("joco", "", "", {
  host: "localhost",
  dialect: "postgres",
});

seqInstance
  .authenticate()
  .then(() => console.log("Connection successful"))
  .catch((error) => console.log(error));
