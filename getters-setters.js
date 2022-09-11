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

const User = seqInstance.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        // we use this.getDataValue('username') instead of this.username because
        // this.username calls the get() function which creates an infinite loop
        const rawValue = this.getDataValue("username");
        return rawValue.toUpperCase();
      },
    },
    password: {
      type: DataTypes.STRING,
      // Currently SETTERS && GETTERS don't support asynchronous functions
      set(value) {
        const hashedPassword = value.toUpperCase();
        this.setDataValue("password", hashedPassword);
      },
    },
    // Virtual fields aren't saved into the database but they are used to get a derived state/value
    // based on the rest of the data saved in the DB
    aboutUser: {
      type: DataTypes.VIRTUAL,
      get() {
        // return `${this.username} ${this.description}`
      },
    },
    email: {
      type: DataTypes.STRING,
      // If a data is allowed to be null (by default all of them is), and we pass in a null value or something similar
      // like undefined all the built in validators will be skiped but the custom validators will be run
      allowNull: true,
      validate: {
        // this is a built in validator there are few more
        // len: [4, 20],
        // isEmail: true,

        isNumeric: {
          msg: "We can define custom error message here",
        },

        isIn: {
          args: ["values we are checking against"],
          msg: "error message",
        },

        // Custom validator function
        // isOldEnough(value) {
        //   if (value < 21) {
        //     throw new Error("Too young");
        //   }
        // },
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    validate: {
      // The context of the model is available so we can use this. and the prop name
      usernamePassMatch() {
        if (this.username === this.password) {
          throw new Error("Username and password can't be the same");
        }
      },
    },
  }
);

// Validate function can be called at this level before we try to save the data into the DB
// const newUser = User.build({ name: 'Jozsef', email: 'joco.udv' });
// newUser.validate();
