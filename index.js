require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// connect to the databes two different method
// const seqInstance = new Sequelize("postgresql://localhost:5432/joco");
const seqInstance = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

// create a new table
const User = seqInstance.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 5], // we can have validations in the model definition
      },
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
    schema: "public",
    freezeTableName: true,
    timestamps: false,
  }
);

// Syncronize the above defined options with the database
// sync() => creates a table if it doesn't exist
// sync({force: true}) => recreates the table
// sync({alter: true}) => perform only necessery changes
User.sync({ alter: true })
  .then((data) => {
    console.log(`User added to DB`);
    // Insert into user (username...) values ('Jozsef Vass'...);
    // First step just creates a JS representation
    // const user = User.build({
    //   username: "Jozsef Vass",
    //   password: "123",
    //   age: "28",
    // });
    // when we call the save method that is when the data gets inserted into the table
    // return user.save();

    // this does the same thing as above just in one step
    return User.create({
      username: "Jozsef Vass",
      password: "123",
      age: "28",
    });

    // creating multiple record at the same time
    // the returned value is an array of object
    // VALIDATION: to run the validation for blukCreate we have to explicitly tell it to sequelize
    // running validation will decreas the performance
    // User.bulkCreate([{}, {}], { validation: true })
  })
  .then((user) => {
    // console.log(`User added to db`);
    // console.log(user.toJSON());
    console.log("User updated!");

    // With user.create() we get additional method in the returned promise
    // that lets us to update the data and save it again to the DB
    user.username = "Nora Sorban";
    // we can proved a list of fields we want to be updated other fields will be ignored by sequelize
    // even if it was changed
    // if we call the save method but there was no change sequelize will detect it and won't
    // generate any query
    // user.save({ fields: ['age'] })
    return user.save();
  })
  .then((user) => {
    console.log("Updated user!");
    console.log(user.toJSON());
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
