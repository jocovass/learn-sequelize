const { Sequelize, DataTypes } = require("sequelize");

// connect to the databes two different method
// const seqInstance = new Sequelize("postgresql://localhost:5432/joco");
const seqInstance = new Sequelize("joco", "", "", {
  host: "localhost",
  dialect: "postgres",
});

// create a new table
const User = seqInstance.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 18,
    },
  },
  {
    freezeTableName: true,
  }
);

// Syncronize the above defined options with the database
// sync() => creates a table if it doesn't exist
// sync({force: true}) => recreates the table
// sync({alter: true}) => perform only necessery changes
User.sync({ alter: true })
  .then((data) => {
    console.log(`User sync successful ${data}`);
  })
  .catch((error) => {
    console.log(`User sync failed ${error}`);
  });

// we can call .sync() on the sequelize instace to sync multiple models also to drop tables
// THESE ARE NOT RECOMENDED because they are destructive operations
// seqInstance.sync().then(() => console.log('same'))
// seqInstance.drop({ match: 'some reqex here '})

// check if the connection was successful
seqInstance
  .authenticate()
  .then(() => console.log("Connection successful"))
  .catch((error) => console.log(error));
